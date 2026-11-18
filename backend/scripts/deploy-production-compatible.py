#!/usr/bin/env python3
"""Additive production release, with contract check, private backup and rollback.

Run only after explicit production approval:
  ALLOW_PRODUCTION_DEPLOY=I_UNDERSTAND_THIS_UPDATES_LIVE AWS_PROFILE=minchopm \
    python3 scripts/deploy-production-compatible.py /tmp/cloud-calendars-api-nest.zip

No environment variables, storage or DNS are changed. SES and legacy API URLs remain.
"""
import datetime
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
import zipfile

FUNCTION = 'cloud-calendars-api'
REGION = 'us-east-1'
ARN = 'arn:aws:lambda:us-east-1:303803840503:function:' + FUNCTION
API = 'https://api.cloud-calendars.com'


def aws(*args):
    result = subprocess.run(['aws', '--region', REGION, *args, '--output', 'json'],
                            check=True, capture_output=True, text=True)
    return json.loads(result.stdout or '{}')


def routes(archive):
    found = set()
    with zipfile.ZipFile(archive) as zipped:
        for name in zipped.namelist():
            if not name.endswith('.controller.js'):
                continue
            source = zipped.read(name).decode()
            prefix = re.search(r"common_\d+\.Controller\)\(['\"]([^'\"]*)", source)
            prefix = prefix.group(1).strip('/') if prefix else ''
            for method, path in re.findall(r"common_\d+\.(Get|Post|Put|Patch|Delete)\)\(['\"]([^'\"]*)", source):
                found.add((method.upper(), '/' + '/'.join(p for p in [prefix, path.strip('/')] if p)))
    return found


def status(path):
    try:
        request = urllib.request.Request(API + path, method='POST' if path.startswith('/web-calendar/providers/') else 'GET')
        with urllib.request.urlopen(request, timeout=10) as response:
            return response.status
    except urllib.error.HTTPError as error:
        return error.code


def wait_updated():
    subprocess.run(['aws', '--region', REGION, 'lambda', 'wait', 'function-updated',
                    '--function-name', FUNCTION], check=True, capture_output=True)


def main():
    if os.environ.get('ALLOW_PRODUCTION_DEPLOY') != 'I_UNDERSTAND_THIS_UPDATES_LIVE':
        raise RuntimeError('Explicit production approval is required.')
    package = Path(sys.argv[1]).resolve()
    if not package.is_file():
        raise RuntimeError('Build the release package first.')
    os.umask(0o077)
    current = aws('lambda', 'get-function', '--function-name', FUNCTION)
    configuration = current['Configuration']
    environment = configuration.get('Environment', {}).get('Variables', {})
    assert configuration['FunctionArn'] == ARN
    assert environment.get('CALENDAR_STORAGE_URL') == 'https://storage.wonek.com'
    assert environment.get('CAL_BUCKET') == 'cal.cloud-calendars.com'
    assert configuration['Handler'] == 'dist/lambda.handler'
    directory = Path.home() / 'Library/Application Support/CloudCalendarsInfrastructure' / (
        'production-backup-' + datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d-%H%M%S'))
    directory.mkdir(parents=True)
    (directory / 'configuration.json').write_text(json.dumps(configuration))
    old_package = directory / 'previous-code.zip'
    urllib.request.urlretrieve(current['Code']['Location'], old_package)
    old_routes, new_routes = routes(old_package), routes(package)
    if len(old_routes) < 40:
        raise RuntimeError('Cannot establish the deployed route contract.')
    missing = old_routes - new_routes
    if missing:
        raise RuntimeError('Release removes deployed routes: ' + repr(sorted(missing)))
    (directory / 'route-contract.json').write_text(json.dumps({
        'old': sorted(old_routes), 'new': sorted(new_routes), 'added': sorted(new_routes-old_routes)}, indent=2))
    print(f'Compatibility gate passed: {len(old_routes)} existing routes retained.', flush=True)
    deployed = False
    try:
        release = aws('lambda', 'update-function-code', '--function-name', FUNCTION,
                      '--revision-id', configuration['RevisionId'], '--zip-file', 'fileb://' + str(package), '--publish')
        deployed = True
        wait_updated()
        checks = {'/auth/providers': 200, '/billing/plans': 200, '/me': 401,
                  '/shared-state': 401, '/web-calendar/state': 401,
                  '/web-calendar/providers/google': 401, '/web-calendar/providers/microsoft': 401,
                  '/icloud-calendars-shared-with-me': 401, '/ios/calendars/account': 401}
        observed = {}
        for attempt in range(3):
            observed = {path: status(path) for path in checks}
            if observed == checks:
                break
            time.sleep(2)
        if observed != checks:
            raise RuntimeError('Production health check failed: ' + repr(observed))
        after = aws('lambda', 'get-function-configuration', '--function-name', FUNCTION)
        if after.get('Environment') != configuration.get('Environment'):
            raise RuntimeError('Production environment changed during release.')
        manifest = {'function': FUNCTION, 'version': release.get('Version'), 'codeSHA256': release['CodeSha256'],
                    'backup': str(directory), 'checks': observed,
                    'timestamp': datetime.datetime.now(datetime.timezone.utc).isoformat()}
        (directory / 'release.json').write_text(json.dumps(manifest, indent=2))
        print(json.dumps(manifest, indent=2))
    except Exception:
        if deployed:
            latest = aws('lambda', 'get-function-configuration', '--function-name', FUNCTION)
            # Do not overwrite a release made concurrently by somebody else.
            if latest.get('CodeSha256') == release.get('CodeSha256'):
                aws('lambda', 'update-function-code', '--function-name', FUNCTION,
                    '--revision-id', latest['RevisionId'], '--zip-file', 'fileb://' + str(old_package))
                wait_updated()
                print('Health check failed; previous production code restored.', file=sys.stderr)
        raise


if __name__ == '__main__':
    try:
        main()
    except subprocess.CalledProcessError:
        print('AWS release operation failed. Credentials and command output have been withheld.', file=sys.stderr)
        sys.exit(1)
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)

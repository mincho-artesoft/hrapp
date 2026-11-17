#!/usr/bin/env python3
"""Deploy only Cloud Calendars Debug. Retain AWS compatibility and SES delivery."""
import datetime
import json
import os
from pathlib import Path
import secrets
import shlex
import subprocess
import tarfile
import tempfile
import time

HERE = Path(__file__).resolve().parent
OPERATOR = Path.home() / 'Library/Application Support/CloudCalendarsInfrastructure'
API = 'https://storage.wonek.com/cloud-calendars-debug'
FUNCTION = 'cloud-calendars-api-debug'
SSH = ['ssh', '-i', str(Path.home()/'.ssh/wonek_aleksandar'), '-o', 'IdentitiesOnly=yes',
       '-o', 'HostKeyAlias=chat.wonek.com', '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes',
       '-o', 'ConnectTimeout=8', 'aleksandar@chat-api.wonek.com']

def aws(*args):
    result = subprocess.run(['aws', '--profile', os.environ.get('AWS_PROFILE', 'minchopm'),
                             '--region', 'us-east-1', *args, '--output', 'json'],
                            check=True, capture_output=True, text=True)
    return json.loads(result.stdout or '{}')

def remote(command, data=None):
    return subprocess.run(SSH + [command], input=data, check=True, capture_output=True).stdout.decode()

def main():
    os.umask(0o077)
    OPERATOR.mkdir(parents=True, exist_ok=True)
    config = aws('lambda', 'get-function-configuration', '--function-name', FUNCTION)
    assert config['FunctionArn'] == 'arn:aws:lambda:us-east-1:303803840503:function:' + FUNCTION
    env = dict(config['Environment']['Variables'])
    assert env['CAL_BUCKET'] == 'cloud-calendars-api-debug-303803840503'
    assert env['CALENDAR_STORAGE_URL'] == 'https://storage.wonek.com'
    backup = OPERATOR/'aws-debug-before-hetzner.json'
    if not backup.exists(): backup.write_text(json.dumps(config))
    token_file = OPERATOR/'hetzner-debug-mail-token'
    if not token_file.exists(): token_file.write_text(secrets.token_urlsafe(48))
    env['EMAIL_RELAY_TOKEN'] = token_file.read_text().strip()
    with tempfile.TemporaryDirectory(prefix='hrapp-hetzner-') as directory:
        directory = Path(directory)
        env_file = directory/'lambda-env.json'
        env_file.write_text(json.dumps({'Variables': env}))
        aws('lambda', 'update-function-configuration', '--function-name', FUNCTION,
            '--revision-id', config['RevisionId'], '--environment', 'file://' + str(env_file))
        for _ in range(30):
            state = aws('lambda', 'get-function-configuration', '--function-name', FUNCTION)
            if state['LastUpdateStatus'] == 'Successful': break
            if state['LastUpdateStatus'] == 'Failed': raise RuntimeError('Debug Lambda config update failed')
            time.sleep(1)
        else: raise RuntimeError('Debug Lambda config update timed out')
        aws('lambda', 'update-function-code', '--function-name', FUNCTION,
            '--revision-id', state['RevisionId'], '--zip-file', 'fileb:///tmp/cloud-calendars-api-nest.zip')

        # The app keeps its existing account namespace and tokens. No AWS keys
        # are copied; only the scoped SES relay credential leaves Lambda.
        env.pop('PUSH_QUEUE_URL', None)
        env.pop('EMAIL_GUARD_TABLE', None)
        env.update(API_URL=API, FEED_HOST=API.removeprefix('https://'), PORT='9471', PUSH_TRANSPORT='storage', AWS_REGION='us-east-1',
                   AWS_EC2_METADATA_DISABLED='true', NODE_ENV='production',
                   EMAIL_RELAY_URL='https://63yo3ore3c.execute-api.us-east-1.amazonaws.com/internal/email/deliver')
        release = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d-%H%M%S')
        target = '/opt/cloud-calendars-debug/releases/' + release
        archive = directory/'app.tar.gz'
        stage = Path('/tmp/cloud-calendars-api-nest-build')
        with tarfile.open(archive, 'w:gz') as tar:
            for name in ['dist', 'node_modules', 'package.json']:
                tar.add(stage/name, arcname=name)
            if (stage/'data').exists():
                tar.add(stage/'data', arcname='data')
            tar.add(HERE/'hetzner-entry.cjs', arcname='hetzner-entry.cjs')
        remote('id cloud-calendars-debug >/dev/null 2>&1 || sudo -n useradd --system --no-create-home --shell /usr/sbin/nologin cloud-calendars-debug')
        uid = int(remote('id -u cloud-calendars-debug').strip())
        gid = int(remote('id -g cloud-calendars-debug').strip())
        remote(f'sudo -n install -d -m 755 {target}; sudo -n install -d -m 700 /etc/cloud-calendars-debug')
        remote(f'sudo -n tar -xzf - -C {target}', archive.read_bytes())
        remote('sudo -n tee /etc/cloud-calendars-debug/environment.json >/dev/null', json.dumps(env).encode())
        remote(f'sudo -n chown {uid}:{gid} /etc/cloud-calendars-debug/environment.json; sudo -n chmod 600 /etc/cloud-calendars-debug/environment.json')
        previous = remote('readlink -f /opt/cloud-calendars-debug/current || true').strip()
        remote(f'sudo -n ln -sfn {target} /opt/cloud-calendars-debug/current')
        def start(path):
            remote('sudo -n docker rm -f cloud-calendars-debug >/dev/null 2>&1 || true')
            remote(f'sudo -n docker run -d --name cloud-calendars-debug --restart unless-stopped '
                   f'--user {uid}:{gid} --read-only --cap-drop ALL --security-opt no-new-privileges:true '
                   '--memory 384m --cpus 1 --pids-limit 128 --tmpfs /tmp:rw,noexec,nosuid,size=32m '
                   f'-p 127.0.0.1:9471:9471 -v {shlex.quote(path)}:/app:ro '
                   '-v /etc/cloud-calendars-debug/environment.json:/run/cloud-calendars.json:ro '
                   '-w /app node:22-alpine node hetzner-entry.cjs')
        start(target)
        for _ in range(20):
            status = remote("curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:9471/auth/providers || true").strip()
            if status == '200': break
            time.sleep(1)
        else:
            if previous and previous != '/opt/cloud-calendars-debug/current': start(previous)
            raise RuntimeError('Hetzner Debug health check failed')

        # Add one isolated location to the already certified HTTPS storage
        # host; leave every existing service and virtual host unchanged.
        nginx = remote('sudo -n cat /etc/nginx/conf.d/calendar-storage.conf')
        marker = '    # Cloud Calendars Debug API\n'
        end_marker = '    # End Cloud Calendars Debug API\n'
        if marker in nginx:
            start_index = nginx.index(marker)
            end_index = nginx.index(end_marker, start_index) + len(end_marker)
            nginx = nginx[:start_index] + nginx[end_index:]
        block = marker + '''    location = /cloud-calendars-debug { return 308 /cloud-calendars-debug/; }
    location ^~ /cloud-calendars-debug/internal/ { return 404; }
    location ^~ /cloud-calendars-debug/ {
        proxy_pass http://127.0.0.1:9471/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto https;
        proxy_connect_timeout 5s;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
''' + end_marker
        position = nginx.rfind('    location / {')
        assert position >= 0 and 'ssl_certificate ' in nginx[:position]
        updated = nginx[:position] + block + nginx[position:]
        remote('sudo -n cp /etc/nginx/conf.d/calendar-storage.conf /etc/nginx/conf.d/calendar-storage.conf.hrapp-backup')
        remote('sudo -n tee /etc/nginx/conf.d/calendar-storage.conf >/dev/null', updated.encode())
        try:
            remote('sudo -n nginx -t && sudo -n systemctl reload nginx')
        except subprocess.CalledProcessError:
            remote('sudo -n cp /etc/nginx/conf.d/calendar-storage.conf.hrapp-backup /etc/nginx/conf.d/calendar-storage.conf')
            raise
        (OPERATOR/'hetzner-debug-deployment.json').write_text(json.dumps({'api': API, 'release': release, 'previous': previous}))
        print('Cloud Calendars Debug API deployed on Hetzner; AWS compatibility and SES retained.')

if __name__ == '__main__':
    try: main()
    except Exception as error:
        # Never echo subprocess arguments containing credentials.
        print('Deployment failed:', type(error).__name__)
        raise SystemExit(1)

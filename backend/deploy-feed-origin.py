#!/usr/bin/env python3
"""Deploy only Cloud Calendars' existing feed CDN origin. Uses the AWS CLI."""
import json
import os
import subprocess
import tempfile
import uuid
from pathlib import Path


def aws(operation, value):
    with tempfile.TemporaryDirectory(prefix='cloud-calendars-cdn-') as directory:
        request = Path(directory)/'request.json'
        request.write_text(json.dumps(value))
        request.chmod(0o600)
        result = subprocess.run(['aws', 'cloudfront', operation, '--cli-input-json', 'file://'+str(request),
                                 '--output', 'json'], check=True, capture_output=True, text=True)
        return json.loads(result.stdout)


def main():
    token = os.environ.get('CALENDAR_FEED_ORIGIN_TOKEN')
    if not token:
        operator = Path(os.environ.get('CALENDAR_FEED_OPERATOR_DIR', str(Path.home()/'Library/Application Support/CloudCalendarsInfrastructure')))
        token = json.loads((operator/'production-storage.json').read_text())['originToken']
    if len(token) < 32:
        raise ValueError('A private feed-origin credential is required')
    distribution_id = 'E38UB52KWYH6V6'
    result = aws('get-distribution-config', {'Id': distribution_id})
    distribution = result['DistributionConfig']
    if distribution['Aliases'].get('Items') != ['cal.cloud-calendars.com']:
        raise ValueError('Refusing to change another distribution')
    origin = next(o for o in distribution['Origins']['Items'] if o['Id'] == 's3-cal')
    origin.update(DomainName='storage.cloud-calendars.com', OriginPath='/feeds/cal.cloud-calendars.com',
                  CustomHeaders={'Quantity': 1, 'Items': [{'HeaderName': 'X-Calendar-Origin', 'HeaderValue': token}]},
                  CustomOriginConfig={'HTTPPort': 80, 'HTTPSPort': 443, 'OriginProtocolPolicy': 'https-only',
                      'OriginSslProtocols': {'Quantity': 1, 'Items': ['TLSv1.2']},
                      'OriginReadTimeout': 30, 'OriginKeepaliveTimeout': 5})
    origin.pop('S3OriginConfig', None)
    origin.pop('OriginAccessControlId', None)
    aws('update-distribution', {'Id': distribution_id, 'IfMatch': result['ETag'], 'DistributionConfig': distribution})
    aws('create-invalidation', {'DistributionId': distribution_id, 'InvalidationBatch': {
        'Paths': {'Quantity': 1, 'Items': ['/*']}, 'CallerReference': str(uuid.uuid4())}})
    print('Cloud Calendars feed origin update submitted; public URLs preserved.')


if __name__ == '__main__':
    main()

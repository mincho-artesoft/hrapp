import base64
import concurrent.futures
import json
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
from http.server import ThreadingHTTPServer
from server import Storage, make_handler


class StorageTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.bucket = 'cal.cloud-calendars.com'
        self.store = Storage(self.directory.name, [self.bucket, 'other-calendar'])

    def tearDown(self):
        self.directory.cleanup()

    def call(self, operation, key='cal/test.json', **args):
        return self.store.execute(dict(Operation=operation, Bucket=self.bucket, Key=key, **args), admin=True)

    def put(self, value, **args):
        return self.call('put', Body=base64.b64encode(value).decode(), **args)

    def test_conditional_create_and_update_are_atomic(self):
        with concurrent.futures.ThreadPoolExecutor(max_workers=16) as pool:
            statuses = list(pool.map(lambda n: self.put(str(n).encode(), IfNoneMatch='*')[0], range(32)))
        self.assertEqual(statuses.count(200), 1)
        self.assertEqual(statuses.count(412), 31)
        etag = self.call('get')[1]['ETag']
        with concurrent.futures.ThreadPoolExecutor(max_workers=16) as pool:
            statuses = list(pool.map(lambda n: self.put(('new'+str(n)).encode(), IfMatch=etag)[0], range(32)))
        self.assertEqual(statuses.count(200), 1)
        self.assertEqual(statuses.count(412), 31)

    def test_versions_delete_markers_and_reopen(self):
        v1 = self.put(b'first', ContentType='text/plain')[1]['VersionId']
        self.put(b'second')
        marker = self.call('delete')[1]['VersionId']
        self.assertEqual(self.call('get')[0], 404)
        self.assertEqual(base64.b64decode(self.call('get', VersionId=v1)[1]['Body']), b'first')
        self.store = Storage(self.directory.name, [self.bucket])
        self.assertEqual(self.call('get')[0], 404)
        self.call('delete', VersionId=marker)
        self.assertEqual(base64.b64decode(self.call('get')[1]['Body']), b'second')

    def test_calendar_inventory_filter_cache_and_pagination(self):
        prefix = 'principal/alice/native-calendars/'
        def write(key, value):
            return self.call('put', key, Body=base64.b64encode(json.dumps(value).encode()).decode())[1]['ETag']

        known = write(prefix+'a', {'accountLocal': True})
        write(prefix+'b', {'accountLocal': False})
        write(prefix+'c', {'accountLocal': True, 'title': 'x'*600000})
        write(prefix+'d', {'accountLocal': True, 'title': 'y'*600000})
        write(prefix+'e', {'accountLocal': True, 'title': 'z'*1100000})
        write('principal/bob/native-calendars/a', {'accountLocal': True})
        write(prefix+'removed', {'accountLocal': True})
        self.call('delete', prefix+'removed')
        def inventory(**kwargs):
            return self.call('list', Prefix=prefix, CalendarInventory='account', KnownETags={prefix+'a': known}, **kwargs)[1]

        page = inventory()
        self.assertEqual([r['Key'] for r in page['Contents']], [prefix+'a', prefix+'c'])
        self.assertNotIn('Body', page['Contents'][0])
        self.assertEqual(len(json.loads(base64.b64decode(page['Contents'][1]['Body']))['title']), 600000)
        self.assertTrue(page['IsTruncated'])
        page = inventory(ContinuationToken=page['NextContinuationToken'])
        self.assertEqual([r['Key'] for r in page['Contents']], [prefix+'d', prefix+'e'])
        self.assertNotIn('Body', page['Contents'][1])
        self.assertFalse(page['IsTruncated'])
        write(prefix+'a', {'accountLocal': True, 'title': 'edited'})
        self.assertIn('Body', inventory()['Contents'][0])
        self.assertEqual(self.call('list', Prefix='principal/', CalendarInventory='all')[0], 400)
        ordinary = self.call('list', Prefix=prefix)[1]['Contents']
        self.assertEqual(len(ordinary), 5)
        self.assertTrue(all('Body' not in item for item in ordinary))

    def test_revision_is_transactional_across_processes_and_read_batches(self):
        token = 'idx/token/test'
        self.call('put', token, Body='e30=')
        stamp = lambda: self.call('get', token)[1]['StorageRevision']
        before = stamp()
        other = Storage(self.directory.name, [self.bucket])
        self.assertEqual(stamp(), before)
        key = 'cal/test/events/one.json'
        self.assertEqual(other.execute(dict(Operation='put', Bucket=self.bucket, Key=key, Body='e30='))[0], 200)
        after_write = stamp()
        self.assertNotEqual(after_write, before)
        status, batch = self.call('readBatch', Reads=[
            dict(Operation='get', Key='missing'),
            dict(Operation='list', Prefix='cal/test/events/', CalendarInventory='documents'),
            dict(Operation='get', Key=key)])
        self.assertEqual(status, 200)
        missing, listing, stored = batch['Results']
        self.assertEqual(missing['Status'], 404)
        self.assertEqual(listing['Result']['Contents'][0]['Body'], stored['Result']['Body'])
        self.assertEqual(self.call('readBatch', Reads=[dict(Operation='delete', Key=key)])[0], 400)
        self.assertEqual(self.call('readBatch', Reads=[dict(Operation='get', Key=key, Bucket='other-calendar')])[0], 400)
        self.assertEqual(stamp(), after_write)
        marker = self.call('delete', key)[1]['VersionId']
        after_delete = stamp()
        self.assertNotEqual(after_delete, after_write)
        self.call('delete', key, VersionId=marker)
        self.assertNotEqual(stamp(), after_delete)
        self.call('delete', token)
        self.assertEqual(self.call('get', token)[0], 404)

    def test_import_retains_etag_and_deleted_state(self):
        self.call('import', VersionId='original-v1', Body='YWJj', ETag='"original"', LastModified='2026-09-01', IsLatest=False)
        self.call('import', VersionId='original-marker', DeleteMarker=True, LastModified='2026-09-02', IsLatest=True)
        self.assertEqual(self.call('get')[0], 404)
        self.assertEqual(self.call('get', VersionId='original-v1')[1]['ETag'], '"original"')
        self.assertEqual(self.call('import', VersionId='original-v1', Body='eHl6', LastModified='2026-09-01')[0], 409)

    def test_pagination_survives_deletion_and_preserves_neighbor(self):
        for n in range(1005):
            self.call('import', VersionId=str(n), Body='eA==', ETag='"x"', LastModified='2026-09-01', IsLatest=n == 1004)
        self.call('put', 'cal/test.json-neighbor', Body='eA==')
        first = self.call('versions', Prefix='cal/test.json')[1]
        self.assertTrue(first['IsTruncated'])
        for version in first['Versions']:
            self.call('delete', VersionId=version['VersionId'])
        second = self.call('versions', Prefix='cal/test.json', KeyMarker=first['NextKeyMarker'],
                           VersionIdMarker=first['NextVersionIdMarker'])[1]
        self.assertEqual(len(second['Versions']), 6)
        for version in second['Versions']:
            if version['Key'] == 'cal/test.json':
                self.call('delete', VersionId=version['VersionId'])
        self.assertEqual(self.call('get')[0], 404)
        self.assertEqual(self.call('get', 'cal/test.json-neighbor')[0], 200)

    def test_http_auth_namespace_and_feed_boundaries(self):
        config = dict(adminToken='a'*48, originToken='o'*48,
                      bucketTokens={self.bucket: 'b'*48, 'other-calendar': 'c'*48})
        http = ThreadingHTTPServer(('127.0.0.1', 0), make_handler(self.store, config))
        thread = threading.Thread(target=http.serve_forever, daemon=True)
        thread.start()
        def request(path='/v1/objects', token='', bucket=None, operation='list'):
            data = json.dumps(dict(Operation=operation, Bucket=bucket or self.bucket)).encode()
            req = urllib.request.Request(f'http://127.0.0.1:{http.server_port}{path}', data=data,
                                         headers={'Authorization': 'Bearer '+token})
            try:
                with urllib.request.urlopen(req) as response:
                    return response.status
            except urllib.error.HTTPError as error:
                return error.code
        try:
            self.assertEqual(request(), 401)
            self.assertEqual(request(token='b'*48), 200)
            self.assertEqual(request(token='b'*48, bucket='other-calendar'), 403)
            self.assertEqual(request(token='b'*48, operation='import'), 400)
            self.assertEqual(request(path='/../objects', token='b'*48), 404)
            with self.assertRaises(urllib.error.HTTPError) as error:
                urllib.request.urlopen(f'http://127.0.0.1:{http.server_port}/feeds/{self.bucket}/principal/private.json')
            self.assertEqual(error.exception.code, 404)
        finally:
            http.shutdown()
            http.server_close()


if __name__ == '__main__':
    unittest.main()

#!/usr/bin/env python3
"""Private calendar object storage. One durable SQLite database per directory.

SQLite transactions preserve conditional writes, versions and delete markers.
The service binds to loopback and is published only through the HTTPS proxy.
"""
import argparse
import base64
import hashlib
import hmac
import json
import re
import sqlite3
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

MAX_BODY = 32 * 1024 * 1024


class Storage:
    def __init__(self, root, buckets):
        self.root = Path(root)
        self.buckets = set(buckets)
        for bucket in self.buckets:
            if not re.fullmatch(r'[a-z0-9][a-z0-9.-]{2,62}', bucket):
                raise ValueError('Invalid storage namespace')
            directory = self.root / bucket
            directory.mkdir(parents=True, exist_ok=True, mode=0o700)
            with self.connect(bucket) as db:
                db.execute('PRAGMA journal_mode=WAL')
                db.executescript('''
                    CREATE TABLE IF NOT EXISTS versions (
                        seq INTEGER PRIMARY KEY AUTOINCREMENT,
                        key TEXT NOT NULL, version TEXT NOT NULL,
                        body BLOB, etag TEXT, content_type TEXT, cache_control TEXT,
                        modified TEXT NOT NULL, deleted INTEGER NOT NULL,
                        UNIQUE(key, version)
                    );
                    CREATE INDEX IF NOT EXISTS version_keys ON versions(key);
                    CREATE TABLE IF NOT EXISTS heads (
                        key TEXT PRIMARY KEY, version TEXT NOT NULL
                    );
                ''')

    @contextmanager
    def connect(self, bucket):
        if bucket not in self.buckets:
            raise PermissionError('Unknown namespace')
        db = sqlite3.connect(self.root / bucket / 'objects.sqlite3', timeout=15)
        db.row_factory = sqlite3.Row
        db.execute('PRAGMA synchronous=FULL')
        db.execute('PRAGMA busy_timeout=15000')
        try:
            with db:
                yield db
        finally:
            db.close()

    @staticmethod
    def current(db, key):
        return db.execute('SELECT v.* FROM versions v JOIN heads h '
                          'ON v.key=h.key AND v.version=h.version WHERE h.key=?', (key,)).fetchone()

    @staticmethod
    def calendar_inventory(db, prefix, after, scope, known):
        if (scope not in ('all', 'account') or not isinstance(known, dict)
                or not re.fullmatch(r'principal/[^/]+/native-calendars/', prefix)):
            return 400, {'error': 'InvalidCalendarInventory'}
        # Read bodies and ETags from the same SQLite snapshot. The upper bound
        # is the first string after all keys starting with this slash-ended prefix.
        db.execute('BEGIN')
        query = ('SELECT h.key, v.version, v.etag, length(v.body) size, v.modified '
                 'FROM heads h JOIN versions v ON h.key=v.key AND h.version=v.version '
                 'WHERE h.key>=? AND h.key<? AND h.key>? AND v.deleted=0 ')
        if scope == 'account':
            query += "AND json_type(CAST(v.body AS TEXT), '$.accountLocal')='true' "
        rows = db.execute(query + 'ORDER BY h.key LIMIT 1001', (prefix, prefix[:-1]+'0', after))
        items = []
        remaining = 1024 * 1024
        more = False
        for row in rows:
            key = row['key']
            inline = known.get(key) != row['etag'] and row['size'] <= 1024 * 1024
            if len(items) == 1000 or (inline and row['size'] > remaining):
                more = True
                break
            item = {'Key': key, 'ETag': row['etag'], 'Size': row['size'], 'LastModified': row['modified']}
            if inline:
                body = db.execute('SELECT body FROM versions WHERE key=? AND version=?',
                                  (key, row['version'])).fetchone()[0]
                item['Body'] = base64.b64encode(body).decode()
                remaining -= len(body)
            items.append(item)
        return 200, {'Contents': items, 'IsTruncated': more,
                     'NextContinuationToken': items[-1]['Key'] if more else None}

    def execute(self, request, admin=False):
        bucket = request.get('Bucket')
        operation = request.get('Operation')
        key = request.get('Key', '')
        if not isinstance(key, str) or len(key.encode('utf-8')) > 1024 or '\x00' in key:
            return 400, {'error': 'InvalidKey'}
        with self.connect(bucket) as db:
            if operation in ('put', 'delete', 'import'):
                if not key:
                    return 400, {'error': 'InvalidKey'}
                db.execute('BEGIN IMMEDIATE')
            if operation == 'get':
                row = self.current(db, key)
                if request.get('VersionId') is not None:
                    row = db.execute('SELECT * FROM versions WHERE key=? AND version=?',
                                     (key, request['VersionId'])).fetchone()
                if row is None or row['deleted']:
                    return 404, {'error': 'NoSuchKey'}
                return 200, {'Body': base64.b64encode(row['body']).decode(),
                             'ETag': row['etag'], 'ContentLength': len(row['body']),
                             'ContentType': row['content_type'], 'CacheControl': row['cache_control'],
                             'VersionId': row['version'], 'LastModified': row['modified']}
            if operation == 'put':
                row = self.current(db, key)
                exists = row is not None and not row['deleted']
                if request.get('IfNoneMatch') == '*' and exists:
                    return 412, {'error': 'PreconditionFailed'}
                if request.get('IfMatch') is not None and (
                        not exists or not hmac.compare_digest(request['IfMatch'], row['etag'])):
                    return 412, {'error': 'PreconditionFailed'}
                body = base64.b64decode(request.get('Body', ''), validate=True)
                etag = '"' + hashlib.md5(body, usedforsecurity=False).hexdigest() + '"'
                version = str(uuid.uuid4())
                db.execute('INSERT INTO versions(key,version,body,etag,content_type,cache_control,modified,deleted) '
                           'VALUES(?,?,?,?,?,?,?,0)', (key, version, body, etag,
                           request.get('ContentType'), request.get('CacheControl'),
                           datetime.now(timezone.utc).isoformat()))
                db.execute('INSERT OR REPLACE INTO heads VALUES(?,?)', (key, version))
                return 200, {'ETag': etag, 'VersionId': version}
            if operation == 'delete':
                version = request.get('VersionId')
                if version is None:
                    version = str(uuid.uuid4())
                    db.execute('INSERT INTO versions(key,version,modified,deleted) VALUES(?,?,?,1)',
                               (key, version, datetime.now(timezone.utc).isoformat()))
                    db.execute('INSERT OR REPLACE INTO heads VALUES(?,?)', (key, version))
                    return 200, {'VersionId': version, 'DeleteMarker': True}
                current = self.current(db, key)
                db.execute('DELETE FROM versions WHERE key=? AND version=?', (key, version))
                if current is not None and current['version'] == version:
                    previous = db.execute('SELECT version FROM versions WHERE key=? ORDER BY seq DESC LIMIT 1',
                                          (key,)).fetchone()
                    db.execute('DELETE FROM heads WHERE key=?', (key,))
                    if previous:
                        db.execute('INSERT INTO heads VALUES(?,?)', (key, previous['version']))
                return 200, {}
            if operation == 'list':
                prefix = request.get('Prefix', '')
                after = request.get('ContinuationToken', '')
                if 'CalendarInventory' in request:
                    return self.calendar_inventory(db, prefix, after, request['CalendarInventory'], request.get('KnownETags', {}))
                rows = db.execute('SELECT v.key, v.etag, length(v.body) size, v.modified FROM heads h '
                                  'JOIN versions v ON h.key=v.key AND h.version=v.version '
                                  'WHERE v.deleted=0 AND substr(v.key,1,?)=? AND v.key>? ORDER BY v.key LIMIT 1001',
                                  (len(prefix), prefix, after)).fetchall()
                return 200, {'Contents': [{'Key': r['key'], 'ETag': r['etag'], 'Size': r['size'],
                                          'LastModified': r['modified']} for r in rows[:1000]],
                             'IsTruncated': len(rows) > 1000,
                             'NextContinuationToken': rows[999]['key'] if len(rows) > 1000 else None}
            if operation == 'versions':
                prefix = request.get('Prefix', '')
                # Immutable sequence cursor remains valid when callers purge a returned page.
                after = int(request.get('VersionIdMarker') or 0)
                rows = db.execute('SELECT v.*, h.version current FROM versions v LEFT JOIN heads h ON h.key=v.key '
                                  'WHERE substr(v.key,1,?)=? AND v.seq>? ORDER BY v.seq LIMIT 1001',
                                  (len(prefix), prefix, after)).fetchall()
                result = {'Versions': [], 'DeleteMarkers': [], 'IsTruncated': len(rows) > 1000}
                for r in rows[:1000]:
                    item = {'Key': r['key'], 'VersionId': r['version'], 'IsLatest': r['version'] == r['current'],
                            'LastModified': r['modified']}
                    if not r['deleted']:
                        item.update(ETag=r['etag'], Size=len(r['body']))
                    result['DeleteMarkers' if r['deleted'] else 'Versions'].append(item)
                if len(rows) > 1000:
                    result.update(NextKeyMarker=rows[999]['key'], NextVersionIdMarker=str(rows[999]['seq']))
                return 200, result
            if operation == 'import' and admin:
                version = request['VersionId']
                deleted = bool(request.get('DeleteMarker'))
                body = None if deleted else base64.b64decode(request['Body'], validate=True)
                existing = db.execute('SELECT * FROM versions WHERE key=? AND version=?', (key, version)).fetchone()
                if existing and (existing['body'] != body or existing['deleted'] != deleted):
                    return 409, {'error': 'ImportConflict'}
                db.execute('INSERT OR IGNORE INTO versions(key,version,body,etag,content_type,cache_control,modified,deleted) '
                           'VALUES(?,?,?,?,?,?,?,?)', (key, version, body, request.get('ETag'),
                           request.get('ContentType'), request.get('CacheControl'), request['LastModified'], deleted))
                if request.get('IsLatest'):
                    db.execute('INSERT OR REPLACE INTO heads VALUES(?,?)', (key, version))
                return 200, {}
            return 400, {'error': 'UnsupportedOperation'}


def make_handler(storage, config):
    class Handler(BaseHTTPRequestHandler):
        server_version = 'CalendarStorage/1'

        def log_message(self, fmt, *args):
            # No object names, tokens, request bodies or query strings in logs.
            pass

        def reply(self, status, value):
            body = json.dumps(value, separators=(',', ':')).encode()
            self.send_response(status)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        def do_GET(self):
            path = urlsplit(self.path).path
            if path == '/health':
                return self.reply(200, {'status': 'ok'})
            # Existing CloudFront feed capabilities continue at the same URLs.
            match = re.fullmatch(r'/feeds/(cal\.cloud-calendars\.com)/(f/[A-Za-z0-9_-]+\.ics)', path)
            if not match or not hmac.compare_digest(self.headers.get('X-Calendar-Origin', ''), config['originToken']):
                return self.reply(404, {'error': 'NotFound'})
            status, result = storage.execute({'Operation': 'get', 'Bucket': match[1], 'Key': match[2]})
            if status != 200:
                return self.reply(status, result)
            body = base64.b64decode(result['Body'])
            self.send_response(200)
            self.send_header('Content-Type', result.get('ContentType') or 'text/calendar; charset=utf-8')
            self.send_header('Cache-Control', 'no-cache, max-age=0, must-revalidate')
            self.send_header('ETag', result['ETag'])
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(body)

        do_HEAD = do_GET

        def do_POST(self):
            if self.path != '/v1/objects':
                return self.reply(404, {'error': 'NotFound'})
            token = self.headers.get('Authorization', '').removeprefix('Bearer ')
            admin = bool(token) and hmac.compare_digest(token, config['adminToken'])
            allowed = [b for b, t in config['bucketTokens'].items() if token and hmac.compare_digest(token, t)]
            if not admin and not allowed:
                return self.reply(401, {'error': 'Unauthorized'})
            try:
                self.connection.settimeout(30)
                length = int(self.headers.get('Content-Length', '-1'))
                if not 0 < length <= MAX_BODY:
                    return self.reply(413, {'error': 'InvalidLength'})
                request = json.loads(self.rfile.read(length))
                if not isinstance(request, dict) or (not admin and request.get('Bucket') not in allowed):
                    return self.reply(403, {'error': 'Forbidden'})
                status, result = storage.execute(request, admin)
                self.reply(status, result)
            except PermissionError:
                self.reply(403, {'error': 'Forbidden'})
            except (ValueError, KeyError, TypeError):
                self.reply(400, {'error': 'InvalidRequest'})
            except Exception:
                self.reply(503, {'error': 'StorageUnavailable'})
    return Handler


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', required=True)
    args = parser.parse_args()
    config = json.loads(Path(args.config).read_text())
    if min(len(t) for t in [config['adminToken'], config['originToken'], *config['bucketTokens'].values()]) < 32:
        raise ValueError('Storage credentials must contain at least 32 characters')
    if set(config['bucketTokens']) != {'cal.cloud-calendars.com'}:
        raise ValueError('This service accepts only the Cloud Calendars production namespace')
    storage = Storage(config['root'], config['bucketTokens'])
    ThreadingHTTPServer(('127.0.0.1', config.get('port', 9467)), make_handler(storage, config)).serve_forever()

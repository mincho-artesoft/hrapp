"""Snapshot the Cloud Calendars SQLite store and verify a dedicated offsite copy."""
import hashlib
import os
import re
import shutil
import sqlite3
import tempfile
from datetime import datetime, timezone
from pathlib import Path

SOURCE = Path('/srv/cloud-calendars-storage/cal.cloud-calendars.com/objects.sqlite3')
LOCAL = Path('/var/backups/cloud-calendars-storage')
MOUNT = Path('/mnt/wonek-storagebox')
OFFSITE = MOUNT / 'server-backups/cloud-calendars-storage'


def digest(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for block in iter(lambda: f.read(1 << 20), b''):
            h.update(block)
    return h.digest()


def snapshot(source, target):
    with sqlite3.connect(source.as_uri() + '?mode=ro', uri=True) as src, sqlite3.connect(target) as dst:
        src.backup(dst)
        if dst.execute('PRAGMA integrity_check').fetchall() != [('ok',)]:
            raise RuntimeError('Snapshot failed integrity check')
        dst.execute('SELECT key,version FROM heads LIMIT 1')
        dst.execute('SELECT key,version FROM versions LIMIT 1')


def main():
    os.umask(0o077)
    LOCAL.mkdir(exist_ok=True, mode=0o700)
    name = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H%M%SZ.sqlite3')
    with tempfile.TemporaryDirectory(dir=LOCAL) as private:
        staged = Path(private) / name
        snapshot(SOURCE, staged)
        staged.replace(LOCAL / name)
    if not os.path.ismount(MOUNT):
        raise RuntimeError('Offsite disk unavailable; local snapshot retained')
    OFFSITE.mkdir(exist_ok=True, parents=True, mode=0o700)
    with tempfile.TemporaryDirectory(dir=OFFSITE) as private:
        staged = Path(private) / name
        shutil.copyfile(LOCAL / name, staged)
        if digest(staged) != digest(LOCAL / name):
            raise RuntimeError('Offsite checksum mismatch')
        staged.replace(OFFSITE / name)
    for directory, keep in [(LOCAL, 2), (OFFSITE, 14)]:
        snapshots = sorted(p for p in directory.iterdir()
                           if p.is_file() and not p.is_symlink()
                           and re.fullmatch(r'\d{4}-\d\d-\d\dT\d{6}Z\.sqlite3', p.name))
        for old in snapshots[:-keep]:
            old.unlink()


if __name__ == '__main__':
    main()

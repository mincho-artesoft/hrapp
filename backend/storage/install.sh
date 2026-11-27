#!/bin/sh
# Run as root on the storage host after provisioning its private config and data.
set -eu
cd "$(dirname "$0")"
test "$(id -u)" = 0
getent passwd cloud-cal-store >/dev/null || useradd --system --user-group --no-create-home --shell /usr/sbin/nologin cloud-cal-store
install -d -m 0700 -o cloud-cal-store -g cloud-cal-store /srv/cloud-calendars-storage
install -d -m 0755 /opt/cloud-calendars-storage
install -m 0644 server.py backup.py /opt/cloud-calendars-storage/
install -m 0644 cloud-calendars-storage.service cloud-calendars-backup.service cloud-calendars-backup.timer /etc/systemd/system/
test -s /etc/cloud-calendars-storage/config.json
test -s /srv/cloud-calendars-storage/cal.cloud-calendars.com/objects.sqlite3
systemctl daemon-reload
systemctl enable cloud-calendars-storage.service cloud-calendars-backup.timer
systemctl restart cloud-calendars-storage.service
systemctl start cloud-calendars-backup.timer

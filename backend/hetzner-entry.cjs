const fs = require('node:fs');
Object.assign(process.env, JSON.parse(fs.readFileSync('/run/cloud-calendars.json', 'utf8')));
require('./dist/standalone');

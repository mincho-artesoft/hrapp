// Run from any directory: node scripts/tests/localization-audit.mjs
// Static coverage, not a substitute for native-speaker or on-device review.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const failures = [];
const targets = ['Calendar', 'CalendarAppClip', 'CalendarWidget'];
const tables = new Map();
let checkedTables = 0;
let checkedLiterals = 0;
const decode = value => JSON.parse('"' + value.replace(/\\u\{([0-9a-fA-F]+)\}/g,
    (_, hex) => String.fromCodePoint(parseInt(hex, 16))) + '"');
const formats = value => [...value.replace(/%%/g, '').matchAll(/%(?:\d+\$)?[+\-0 ]*\d*(?:\.\d+)?(?:lld|ld|d|f|@)/g)]
    .map(match => match[0].replace(/%\d+\$/, '%')).sort().join(',');

function table(file) {
    if (tables.has(file)) return tables.get(file);
    if (!fs.existsSync(file)) {
        failures.push('Missing table: ' + path.relative(root, file));
        return {};
    }
    const result = JSON.parse(execFileSync('plutil', ['-convert', 'json', '-o', '-', file], { encoding: 'utf8' }));
    tables.set(file, result);
    checkedTables++;
    return result;
}

for (const target of targets) {
    const directory = path.join(root, target);
    const locales = fs.readdirSync(directory).filter(name => name.endsWith('.lproj'));
    const names = fs.readdirSync(path.join(directory, 'en.lproj')).filter(name => name.endsWith('.strings'));
    for (const name of names) {
        const english = table(path.join(directory, 'en.lproj', name));
        for (const locale of locales) {
            const localized = table(path.join(directory, locale, name));
            for (const [key, value] of Object.entries(english)) {
                const location = `${target}/${locale}/${name}: ${key}`;
                if (typeof localized[key] !== 'string' || !localized[key].trim()) failures.push('Missing/empty: ' + location);
                else if (formats(value) !== formats(localized[key])) failures.push('Format placeholders differ: ' + location);
            }
        }
    }
}

// These are intentionally untranslated brand names, not UI copy.
const brands = new Set(['Cloud Calendars', ' Weather']);
// Detect direct literal keys in the common SwiftUI and Foundation APIs.
// Interpolations and keys assembled at runtime need separate review.
const literalCall = /(?:\b(?:Text|Label|Button|Toggle|TextField|SecureField|Section|ContentUnavailableView|navigationTitle|accessibilityLabel|accessibilityHint|alert|confirmationDialog|NSLocalizedString|localizedEventEditorString)\s*\(\s*|\bString\s*\(\s*localized:\s*)"((?:\\.|[^"\\])*)"/g;
const files = execFileSync('rg', ['--files', ...targets, '-g', '*.swift'], { cwd: root, encoding: 'utf8' }).trim().split('\n');
for (const file of files) {
    // Fixture copy is not shipped as a user-facing screen.
    if (file.startsWith('Calendar/Screenshots/')) continue;
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    const english = table(path.join(root, file.split('/')[0], 'en.lproj/Localizable.strings'));
    for (const match of source.matchAll(literalCall)) {
        if (match[1].includes('\\(')) continue;
        const key = decode(match[1]);
        if (!/[A-Za-z]/.test(key) || brands.has(key) || key.startsWith('https://')) continue;
        checkedLiterals++;
        if (!(key in english)) failures.push(`${file}:${source.slice(0, match.index).split('\n').length}: missing literal ${JSON.stringify(key)}`);
    }
    // Main app has an in-app language override. String(localized:) uses the
    // process language; use NSLocalizedString (our Bundle override) instead.
    if (file.startsWith('Calendar/') && /\bString\(localized:\s*"/.test(source)) failures.push('Bypasses app language: ' + file);
}

const intro = fs.readFileSync(path.join(root, 'Calendar/Main/CalendarSharingIntroductionView.swift'), 'utf8');
if (!intro.includes('Image("AppHeaderIcon")')) failures.push('Introduction must use the app logo');
if (!intro.includes('VStack(alignment: .leading') || !intro.includes('alignment: .leading)')) failures.push('Introduction must preserve semantic leading alignment');
const header = fs.readFileSync(path.join(root, 'Calendar/MonthView/WeekdayHeaderView.swift'), 'utf8');
if (!header.includes('cal.locale = locale')) failures.push('Month weekday names must use the environment locale');

if (failures.length) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
} else {
    console.log(`PASS: ${checkedTables} localization tables, ${checkedLiterals} direct literal keys, format placeholders, app-language routing and intro/weekday layout guards.`);
    console.log('Manual review remains required for dynamic keys, translation quality and full-screen LTR/RTL layout.');
}

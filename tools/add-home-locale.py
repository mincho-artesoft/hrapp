#!/usr/bin/env python3
"""
Write one or more languages' home-page copy and wire them into the registry.

Input is JSON on stdin -- one document or an array -- each {"code", "const",
"copy": {...}} where copy matches the HomeCopy interface. The file, the export,
the import and the registry entry are all derived, so adding a language is
content and nothing else.

Structure is checked against en-US before anything is written: a missing key
would render as `undefined` on a live page, and a stray one is a typo that
TypeScript would catch but only after a two-minute build.
"""
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
EN = ROOT / 'src/app/content/home/en-US.ts'


def shape(value, path='copy'):
    """A nested set of key paths, so two objects can be compared structurally."""
    if isinstance(value, dict):
        out = set()
        for k, v in value.items():
            out.add(f'{path}.{k}')
            out |= shape(v, f'{path}.{k}')
        return out
    if isinstance(value, list):
        # Lists are positional; compare the first element's shape only.
        return shape(value[0], f'{path}[]') if value else set()
    return set()


def ts(value, indent=1):
    pad = '  ' * indent
    if isinstance(value, dict):
        inner = ''.join(
            f'{pad}  {k if re.fullmatch(r"[A-Za-z_][A-Za-z0-9_]*", k) else repr(k)}: '
            f'{ts(v, indent + 1)},\n'
            for k, v in value.items())
        return '{\n' + inner + pad + '}'
    if isinstance(value, list):
        inner = ''.join(f'{pad}  {ts(v, indent + 1)},\n' for v in value)
        return '[\n' + inner + pad + ']'
    return "'" + str(value).replace('\\', '\\\\').replace("'", "\\'") + "'"


def english():
    """The English copy as a dict, read back out of the TypeScript file."""
    src = EN.read_text()
    body = src[src.index('= {') + 2:src.rindex('};') + 1]
    body = re.sub(r'/\*.*?\*/', '', body, flags=re.S)
    body = re.sub(r'//.*', '', body)
    body = re.sub(r'([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:', r'\1"\2":', body)
    body = re.sub(r',(\s*[}\]])', r'\1', body)
    body = body.replace('\\n', ' ')
    # Single-quoted strings, with escaped quotes inside.
    def q(m):
        return json.dumps(m.group(1).replace("\\'", "'"))
    body = re.sub(r"'((?:[^'\\]|\\.)*)'", q, body)
    return json.loads(body)


REF = shape(english())


def add(doc):
    code, const, copy = doc['code'], doc['const'], doc['copy']
    got = shape(copy)
    missing, extra = REF - got, got - REF
    if missing or extra:
        for k in sorted(missing):
            print(f'  {code}: MISSING {k}', file=sys.stderr)
        for k in sorted(extra):
            print(f'  {code}: UNKNOWN {k}', file=sys.stderr)
        raise SystemExit(f'{code}: shape does not match en-US')

    out = ROOT / f'src/app/content/home/{code}.ts'
    out.write_text(
        "import { HomeCopy } from './types';\n\n"
        f'/** The home page in {doc.get("language", code)}. */\n'
        f'export const HOME_{const}: HomeCopy = {ts(copy)};\n')

    reg = ROOT / 'src/app/content/home/registry.ts'
    s = reg.read_text()
    if f'HOME_{const}' not in s:
        s = s.replace("import { HomeCopy } from './types';",
                      f"import {{ HOME_{const} }} from './{code}';\n"
                      "import { HomeCopy } from './types';")
        s = s.replace("  'en-US': HOME_EN_US,\n",
                      f"  'en-US': HOME_EN_US,\n  '{code}': HOME_{const},\n")
        reg.write_text(s)
    print(f'  {code}: home page translated')


docs = json.load(sys.stdin)
for d in (docs if isinstance(docs, list) else [docs]):
    add(d)

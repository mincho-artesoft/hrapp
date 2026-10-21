#!/usr/bin/env python3
"""
Write one or more languages' articles and wire them into the registry.

The twenty-four languages beyond the core five each get the same four articles:
the weather claim that makes the app different, the one-view claim, the sharing
feature, and the price. Four is enough for a language to be worth indexing and
few enough to be written rather than machine-translated.

Input is JSON on stdin -- one document or an array of them, each shaped
{"code", "const", "chrome": {...}, "articles": {slug: {...}}}. Everything else
(directory name, imports, registry entry, ordering) is derived, so a batch of
six languages is six documents and no hand-editing of shared files.
"""
import json
import pathlib
import re
import sys


def q(t):
    return "'" + t.replace("\\", "\\\\").replace("'", "\\'") + "'"


def add(d):
    code, const = d["code"], d["const"]
    root = pathlib.Path("src/app/content") / code
    root.mkdir(parents=True, exist_ok=True)

    fields = "".join(f"  {k}: {q(v)},\n" for k, v in d["chrome"].items())
    (root / "chrome.ts").write_text(
        "import { ArticleChrome } from '../types';\n\n"
        "/** The words every article in this language shares. */\n"
        f"export const CHROME_{const}: ArticleChrome = {{\n{fields}}};\n")

    blocks = []
    for slug, a in d["articles"].items():
        secs = "".join(
            "      {\n        heading: %s,\n        body: [\n%s        ],\n      },\n"
            % (q(h), "".join("          %s,\n" % q(b) for b in body))
            for h, body in a["sections"])
        claims = "".join("      %s: %s,\n" % (k, q(v)) for k, v in a.get("claims", {}).items())
        prac = "".join("      %s,\n" % q(s) for s in a["practical"])
        see = ", ".join(q(s) for s in a.get("see", []))
        blocks.append(
            f"  '{slug}': {{\n"
            f"    title: {q(a['title'])},\n"
            f"    short: {q(a['short'])},\n"
            f"    description: {q(a['description'])},\n"
            f"    lede: {q(a['lede'])},\n"
            f"    commonBelief: {q(a['belief'])},\n"
            f"    sections: [\n{secs}    ],\n"
            f"    claims: {{\n{claims}    }},\n"
            f"    practical: [\n{prac}    ],\n"
            f"    seeAlso: [{see}],\n"
            f"  }},")

    (root / "articles.ts").write_text(
        "import { LocalisedArticle } from '../types';\n\n"
        "/**\n"
        " * The four articles this language carries.\n"
        " *\n"
        " * Chosen one per intent -- weather, one view, sharing, price -- so the language\n"
        " * answers a whole question rather than a quarter of four. The numbers are not\n"
        " * here: they live once in article-facts.ts and join the prose by id, so a\n"
        " * translation can rewrite every sentence without touching a figure.\n"
        " */\n"
        f"export const ARTICLES_{const}: Readonly<Record<string, LocalisedArticle>> = {{\n"
        + "\n\n".join(blocks) + "\n};\n")

    # Article prose stays in a locale chunk; never import it into the shell.
    lazy = pathlib.Path("src/app/content/article-locales") / f"{code}.ts"
    lazy.parent.mkdir(parents=True, exist_ok=True)
    if not lazy.exists():
        lazy.write_text(
            "import type { ArticleLocale } from '../types';\n"
            f"import {{ ARTICLES_{const} }} from '../{code}/articles';\n"
            f"import {{ CHROME_{const} }} from '../{code}/chrome';\n"
            f"export const ARTICLE_LOCALE: ArticleLocale = {{ chrome: CHROME_{const}, articles: ARTICLES_{const} }};\n")
    reg = pathlib.Path("src/app/content/registry.ts")
    text = reg.read_text()
    loader_key = json.dumps(code)
    if f"  {loader_key}:" not in text:
        anchor = "const LOADERS: Readonly<Record<string, () => Promise<{ ARTICLE_LOCALE: ArticleLocale }>>> = {"
        if text.count(anchor) != 1:
            raise ValueError("Article loader registry changed; review registration before continuing")
        text = text.replace(anchor, anchor + f"\n  {loader_key}: () => import('./article-locales/{code}'),")
        reg.write_text(text)
    print(f"  {code}: {len(d['articles'])} articles")


docs = json.load(sys.stdin)
for doc in (docs if isinstance(docs, list) else [docs]):
    add(doc)

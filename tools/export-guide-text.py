"""Export visible English comparison and guide text with GFM Markdown tables; never execute HTML or infer missing content."""
from html.parser import HTMLParser
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DIST = ROOT / 'dist/arte-calendar/browser'
VOID_TAGS = {'img', 'br', 'hr', 'input', 'source', 'meta', 'link', 'wbr'}


class ArticleText(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.active = False
        self.article_depth = 0
        self.skip = 0
        self.block = None
        self.buf = []
        self.lines = []
        self.links = []
        self.in_table = False
        self.in_thead = False
        self.table_caption = None
        self.table_headers = []
        self.table_rows = []
        self.current_cells = []
        self.current_row_is_th = True

    def _clean(self, raw: str, escape_pipes: bool = False) -> str:
        text = re.sub(r'\s+', ' ', raw).strip()
        if escape_pipes:
            text = text.replace('|', r'\|')
        return text

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'article':
            self.article_depth += 1
            self.active = True
        if not self.active:
            return
        if self.skip:
            if tag not in VOID_TAGS:
                self.skip += 1
            return
        if (
            tag in {'cc-more-apps', 'nav'}
            or (tag == 'section' and '__gallery' in attrs.get('class', ''))
        ):
            self.skip = 1
            return

        if tag == 'table':
            self.in_table = True
            self.in_thead = False
            self.table_caption = None
            self.table_headers = []
            self.table_rows = []
            self.current_cells = []
            return

        if self.in_table:
            if tag == 'thead':
                self.in_thead = True
            elif tag == 'tr':
                self.current_cells = []
                self.current_row_is_th = True
            elif tag in {'caption', 'th', 'td'} and self.block is None:
                self.block = tag
                self.buf = []
                if tag == 'td':
                    self.current_row_is_th = False
            elif tag == 'a' and self.block:
                self.links.append(attrs.get('href', ''))
            return

        if tag in {'h1', 'h2', 'h3', 'p', 'dt', 'dd', 'li'} and self.block is None:
            self.block = tag
            self.buf = []
        elif tag == 'p' and self.block == 'li' and self.buf:
            self.buf.append(' — ')
        if tag == 'a' and self.block:
            self.links.append(attrs.get('href', ''))

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID_TAGS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        if not self.active:
            return
        if self.skip:
            self.skip -= 1
            return

        if tag == 'a' and self.block and self.links:
            url = self.links.pop()
            if url and not url.startswith('#'):
                if url.startswith('/'):
                    url = 'https://www.cloud-calendars.com' + url
                self.buf.append(' (' + url + ')')

        if self.in_table:
            if tag == self.block:
                if tag == 'caption':
                    cap = self._clean(''.join(self.buf))
                    if cap:
                        self.table_caption = cap
                elif tag in {'th', 'td'}:
                    self.current_cells.append(self._clean(''.join(self.buf), escape_pipes=True))
                self.block = None
                self.buf = []
            elif tag == 'tr':
                if self.current_cells:
                    if self.in_thead or (not self.table_headers and self.current_row_is_th):
                        self.table_headers = self.current_cells
                    else:
                        self.table_rows.append(self.current_cells)
                self.current_cells = []
            elif tag == 'thead':
                self.in_thead = False
            elif tag == 'table':
                headers = self.table_headers
                rows = self.table_rows
                if not headers and rows:
                    headers = rows[0]
                    rows = rows[1:]
                if headers:
                    col_count = len(headers)
                    header_line = '| ' + ' | '.join(headers) + ' |'
                    sep_line = '| ' + ' | '.join(['---'] * col_count) + ' |'
                    row_lines = []
                    for row in rows:
                        padded = (row + [''] * col_count)[:col_count]
                        row_lines.append('| ' + ' | '.join(padded) + ' |')
                    md_table = '\n'.join([header_line, sep_line] + row_lines)
                    if self.table_caption:
                        md_table = f'*{self.table_caption}*\n\n{md_table}'
                    self.lines.append(md_table)
                self.in_table = False
            return

        if tag == self.block:
            text = self._clean(''.join(self.buf))
            if text:
                prefix = {
                    'h1': '# ',
                    'h2': '## ',
                    'h3': '### ',
                    'dt': '### ',
                    'li': '- ',
                }.get(tag, '')
                self.lines.append(prefix + text)
            self.block = None
            self.buf = []

        if tag == 'article':
            self.article_depth -= 1
            if self.article_depth == 0:
                self.active = False

    def handle_data(self, data):
        if self.active and not self.skip and self.block:
            self.buf.append(data)


sections = []
proof = []

# 1. Export Comparisons Hub (/compare/) and all prerendered Comparison pages (/compare/<slug>/)
compare_dir = DIST / 'compare'
comparison_targets = []
if (compare_dir / 'index.html').exists():
    comparison_targets.append(('compare', compare_dir / 'index.html', 'https://www.cloud-calendars.com/compare/'))
    for child in sorted(compare_dir.iterdir()):
        if child.is_dir() and (child / 'index.html').exists():
            slug = child.name
            comparison_targets.append(
                (f'compare/{slug}', child / 'index.html', f'https://www.cloud-calendars.com/compare/{slug}/')
            )

for key, path, canonical in comparison_targets:
    s = path.read_text(encoding='utf-8')
    parser = ArticleText()
    parser.feed(s)
    heading = next((i for i, line in enumerate(parser.lines) if line.startswith('# ')), None)
    assert heading is not None, key
    parser.lines = parser.lines[heading:]
    assert canonical in s, key
    text = '\n\n'.join(parser.lines)
    sections.append('Source: ' + canonical + '\n\n' + text)
    proof.append({'slug': key, 'source': canonical, 'blocks': len(parser.lines), 'characters': len(text)})

# 2. Export selected English guides (/articles/<slug>/)
selection = json.loads((ROOT / 'tools/guide-text-selection.json').read_text(encoding='utf-8'))
for slug in selection:
    path = DIST / 'articles' / slug / 'index.html'
    s = path.read_text(encoding='utf-8')
    parser = ArticleText()
    parser.feed(s)
    heading = next((i for i, line in enumerate(parser.lines) if line.startswith('# ')), None)
    assert heading is not None, slug
    parser.lines = parser.lines[heading:]
    canonical = 'https://www.cloud-calendars.com/articles/' + slug + '/'
    assert canonical in s, slug
    text = '\n\n'.join(parser.lines)
    sections.append('Source: ' + canonical + '\n\n' + text)
    proof.append({'slug': slug, 'source': canonical, 'blocks': len(parser.lines), 'characters': len(text)})

full = (
    '# Cloud Calendars — English comparisons & selected guide text\n\n'
    'Exported from the published HTML for the 30 multi-table comparisons, the comparisons hub, and the guides listed below. '
    'Arte Soft develops Cloud Calendars and publishes these comparisons and guides. They include product-source checks, '
    'structured Markdown comparison matrices, and provider references; they are not independent device benchmarks. '
    'Other English guides and translations remain available through llms.txt.\n\n'
    + '\n\n---\n\n'.join(sections)
    + '\n'
)
(DIST / 'llms-full.txt').write_text(full, encoding='utf-8')

if '--write-qa' in sys.argv:
    (ROOT / 'research/guide-text-export-qa.json').write_text(
        json.dumps(
            {
                'guides': len(proof),
                'selection': 'tools/guide-text-selection.json + /compare/*',
                'extraction': 'Visible article headings, paragraphs, GFM Markdown tables, lists, FAQs and source links; gallery/other-app cards excluded.',
                'exportedCharacters': len(full),
                'records': proof,
            },
            indent=2,
        )
        + '\n',
        encoding='utf-8',
    )

print(
    'guide text export:',
    len(comparison_targets),
    'comparison pages +',
    len(selection),
    'English guides,',
    len(full),
    'characters',
)

# Article content and locale loading

Article routes and the language switcher use `src/app/content/article-index.ts`, generated from the exact locale aggregates under `src/app/content/article-locales/`. The app shell imports only this index. Route resolvers load the required language before rendering an article or hub; full HTML remains prerendered.

Edit existing prose in its original `content/<locale>/articles*.ts` module. When adding another module, import and spread it in that locale's aggregate, preserving intended override order. Do not import prose from the app shell or add it to the lightweight index by hand.

`npm run build` regenerates the index before compiling and prerendering. `npm start` regenerates before serving. If you add or remove slugs while a dev server is already running, run `node tools/build-article-index.mjs` again so language availability updates. Prose-only edits do not change the slug index.

`tools/add-locale.py` registers new locale chunks; configure the locale in `core/locales.ts` as appropriate. It is an authoring helper, not an instruction to overwrite existing translated source. Review generated files before publishing.

## English growth without loading every article body

The English authoring aggregate remains the editorial source of truth. The index generator evaluates it at build time and writes `content/generated-english/`:

- `hub.generated.ts` has titles, card descriptions and dates only. Empty prose fields are metadata placeholders and must never be rendered as the requested article body.
- `legacy.generated.ts` is the complete payload for the 73 baseline articles recorded in the editorial manifest.
- Each subsequently approved English article gets its own `slug.generated.ts` module, referenced by the generated dynamic loader.

The route resolver uses `loadArticleContentFor(code, slug)`. An English hub loads metadata; an English article additionally loads its requested body. Legacy articles retain the shared legacy fallback; new articles do not pull that fallback or other new article bodies. Metadata for sibling short titles remains available for related links. Translated locale loading is unchanged.

Do not hand-edit generated files or expand the baseline to avoid article splitting or editorial review. `npm run build` and `npm start` regenerate them; after adding an English module to the source aggregate during an existing development session, rerun the generator. Keep article body loading behind the resolver rather than calling the metadata-only `loadContentFor('en-US')` from an article renderer.

# Article content and locale loading

Article routes and the language switcher use `src/app/content/article-index.ts`, generated from the exact locale aggregates under `src/app/content/article-locales/`. The app shell imports only this index. Route resolvers load the required language before rendering an article or hub; full HTML remains prerendered.

Edit existing prose in its original `content/<locale>/articles*.ts` module. When adding another module, import and spread it in that locale's aggregate, preserving intended override order. Do not import prose from the app shell or add it to the lightweight index by hand.

`npm run build` regenerates the index before compiling and prerendering. `npm start` regenerates before serving. If you add or remove slugs while a dev server is already running, run `node tools/build-article-index.mjs` again so language availability updates. Prose-only edits do not change the slug index.

`tools/add-locale.py` registers new locale chunks; configure the locale in `core/locales.ts` as appropriate. It is an authoring helper, not an instruction to overwrite existing translated source. Review generated files before publishing.

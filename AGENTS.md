# Calendar interface localization

- Apply these rules to every new or changed user-facing screen on iPhone, iPad, Mac and the web, including guest views, sheets, popovers, menus, status messages and accessibility labels.
- Use the selected app language and ship translations for every supported locale. Reuse existing calendar keys and translated categories. Preserve format placeholders, plural rules, product names and user-entered content. Keep native and web wording aligned for the same action.
- Use the app’s date, time, numeral, first-weekday and measurement preferences. In System mode, follow the device setting. Keep booking time zones and all-day boundaries intact. Store and transmit dates, recurrence rules and identifiers independently of display formatting.
- Use semantic leading/trailing alignment and directional navigation symbols. Mirror layout, navigation and interaction together in RTL. Native presentations must inherit the app preferences. On the web, keep dialogs and popovers inside the calendar language and direction context.
- Verify changed flows in LTR and RTL with a non-English language, both 12- and 24-hour time, an explicit date format and first weekday. Include live preference changes, accessible labels and narrow and wide layouts when relevant. Run the native localization audit and web calendar tests when changing calendar UI or catalogs.

Run `node native/scripts/tests/localization-audit.mjs` from the repository root. In `web/`, run `npm run test:calendar-native`, then `npm run build` and `node --test scripts/tests/calendar-apple-session.test.mjs` for the browser checks. Set `CHROME_CHANNEL=chrome` to use an installed Chrome.

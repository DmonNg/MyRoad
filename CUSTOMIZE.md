# MyRoad: beginner customization guide

You can change the look and wording of MyRoad with HTML and CSS. The bus planner, map, and GPS use JavaScript behind the scenes; you can leave those files alone unless you want to change how the app works.

Before editing, make a copy of the whole `MyRoad-main` folder. Change one thing at a time, refresh the page, and keep the copy if the change works.

## Quick map of the files

| What you want to change | File to open | What to look for |
|---|---|---|
| Colors, fonts, spacing, button shapes, and screen layout | `css/styles.css` | The `:root` color list near the top, then rules named for parts such as `.topbar`, `.sheet`, `.btn`, and `.card` |
| Page sections and the wording shown in the page | `index.html` | The visible text and HTML elements. Keep existing `id` values and script tags in place. |
| Translated wording | `js/i18n.js` | The same text key in English (`en`), Malay (`ms`), and Chinese (`zh`) |
| Pictures | `assets/img/` | Replace an image with another image using the same filename and roughly the same shape |
| Default map tilt and starting map location | `js/map.js` | `DIGI_TILT` and the `setView([latitude, longitude], zoom)` line |
| Bus timetable and route behavior | `js/schedule.js` and `js/app.js` | These are app logic; changing them needs JavaScript knowledge |
| Feedback form settings | `js/config.js` | Feedback link settings only; this does not control the bus or map |

## Safe first edits

### Change a color

Open `css/styles.css`. Near the top, find the color names inside `:root`, for example `--blue`, `--green`, and `--bg`. Change only the color value after the name. Keep the `--` name, colon, and semicolon.

```css
--blue: #1558d6;
```

Colors use six-digit hex values in the form `#RRGGBB`. A color picker can provide this value.

### Change words

For a translated label, open `js/i18n.js` and search for the English text. Each language has its own entry with the same key. Change the words after the colon, but keep the key and quotation marks. If you only want to change a heading that appears once, you can edit its text in `index.html` instead; translated labels may be replaced when the language is changed.

### Replace a picture

Put the replacement image in `assets/img/` and give it the same filename as the picture you are replacing, such as `trainer-avatar.jpg`. Keep a copy of the original first. If your replacement is PNG, the filename in `index.html` or CSS also needs to end in `.png`.

### Change DigiWorld's starting tilt

In `js/map.js`, find `const DIGI_TILT = 35;`. Change `35` to an angle between `5` and `60` degrees.

## Please keep these parts intact

- Keep the `<script defer src="js/...">` lines at the bottom of `index.html` and in their current order. The app files depend on that order.
- Keep HTML `id` values such as `map`, `mapStyle`, `fromIn`, and `tripOut`. JavaScript uses them to connect buttons, settings, and map elements.
- Keep all three language sections in `js/i18n.js`; otherwise one of the language choices can show missing text.
- Avoid changing `js/schedule.js`, `js/plan.js`, `js/routes-tab.js`, `js/stops-gps.js`, and `js/map.js` unless you want to change app behavior. These files calculate trips, draw routes, and operate the map.

## If a change does not appear

Refresh the page. If it still looks unchanged after publishing, the browser may have cached the old CSS or JavaScript. The version tags such as `styles.css?v4` and `app.js?v4` are cache labels; after publishing a code change, update the number consistently in `index.html` so browsers fetch the new files.

This guide covers common visual edits. Making every bus, map, and GPS behavior adjustable without JavaScript would require a larger app redesign.

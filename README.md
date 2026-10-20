# FlashHook public mobile preview

Live preview: https://robertbarclay67.github.io/flashhook-mobile-preview/

This standalone public interface contains no private FlashHook code, repository history, assets, songs, recordings, credentials, or internal documents. It has no external dependencies, analytics, network calls, audio capture, upload, account, or cloud sync features. GitHub Pages serves the static HTML.

## October 19, 2026 update

- Music defaults to electric lime; Comedy defaults to purple. Switching studio updates the brand accent, header line, studio label, selected studio button, capture controls, notice border, Settings heading, and studio focus outlines.
- The universal Idea Pool stays neutral, including its selected editor, save button, and focus outlines. Saved ideas remain shared across studios.
- Expand **Settings** to select an independent accent per category. Seven named high-contrast colors are available. Changes apply immediately; **Restore default colors** resets colors without removing ideas or categories.
- The **Studio** menu lists all categories. Under Settings, enter a name and choose **Add category** to create a generic studio with a distinct initial accent. Custom categories support the same preview controls and their own color settings; they do not add specialized recording or generation features. Music and Comedy retain shortcut buttons. Historical additional category names were unavailable, so none were invented.
- Native disclosure, selects, buttons, associated input labels, visible focus indicators, pressed states, and polite save/status messages support keyboard and assistive technology use. Controls are at least 44 pixels high; the layout wraps on small screens.
- Existing local ideas use the original `flashhook-public-preview-ideas-v1` key. Colors use `flashhook-public-preview-colors-v1`; custom categories use `flashhook-public-preview-categories-v1`. Values are validated before use, and user text renders as text, not HTML. Unreadable idea storage is not overwritten. Unavailable storage produces a visible session-only warning instead of a false save confirmation.

## Use and limitations

Settings and ideas stay on the current browser/device and origin. Clearing browser site data removes them. New visits open Music with its saved accent. Selecting another category does not discard editor drafts. Lyrics and Key Data Points are in-memory preview editors and do not persist across reloads, matching the prior preview. Only saved ideas persist. Recording and audio import show explanatory notices and remain disabled.

Custom categories are limited to 20, with names up to 32 characters and no duplicate names. Color choices may be shared between categories. A user can choose different colors independently; the seven-color palette repeats for later additions.

## Verification and release

Before release, checked JavaScript syntax; all seven accents exceed 7.9:1 against the darkest secondary control surface (`#242b30`), and dark accent-button text also exceeds AA contrast. Checked studio switching, independent Music/Comedy colors, custom category creation and color persistence across reload, default restoration, neutral Idea Pool, editor switching and draft retention, capture shortcut focus, and layouts at 320 and 390 pixels without horizontal page overflow. Browser viewport tests do not replace testing on a physical phone or a screen reader.

Deployment: commit the reviewed `index.html` and this README to `main`. The existing GitHub Pages deployment publishes the repository root. No build dependencies are required. After deployment, verify the HTTPS URL and its Settings controls at a mobile viewport; inspect the Pages Actions run for success.

Rollback: revert the theme/category commit on `main` and allow Pages to redeploy if the page fails to load, studio switching fails, or saving ideas regresses. The original idea storage key is unchanged, and theme/category keys are isolated, so an interface rollback does not delete saved ideas.

To disable hosting, use repository **Settings → Pages → Branch → None → Save**. The public repository remains available until separately removed.

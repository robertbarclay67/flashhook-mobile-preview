# Flash-Hook sneak peek and studio preview

[Open Flash-Hook](https://flash-hook.com/) · [Try the studio preview](https://flash-hook.com/studio.html)

## Public sneak peek

`index.html` is the public introduction to Flash-Hook. The original working interface is preserved at `studio.html`, with a Home link. Registration and login link to `account.html`, backed by Supabase Authentication. Plans display Basic **$9/month**, Advanced **$19/month**, and Pro **$39/month**, with **Checkout coming soon** on disabled buttons. Regular annual prices are $75.60, $159.60, and $327.60 (30% below 12 monthly payments). Code **TAYLOR** gives 40% total savings versus 12 monthly payments for the first annual term: $64.80, $136.80, and $280.80. It replaces the regular annual discount; discounts do not stack. Cards show the regular annual renewal amounts. Prices exclude applicable tax. Feature limits and billing terms remain to be finalized before checkout opens; account credentials are sent directly to Supabase, and no payment information, checkout, or recurring charges are enabled. Billing, subscription management, and cloud sync remain future implementation work.

The landing page was checked at desktop and phone sizes, including preview navigation and horizontal overflow. Moving the studio to another path on the same origin keeps its existing storage keys; data from the previous github.io origin does not automatically migrate.

This standalone public interface contains no private Flash-Hook source, repository history, songs, recordings, assets, credentials, or internal documents. GitHub Pages serves the static interface. The account page loads a pinned Supabase client from jsDelivr and connects directly to Supabase; the studio has no analytics, uploads, cloud backup, or sync.

## Accounts

Registration, email confirmation, login, logout, confirmation resend, and password recovery use Supabase Authentication. The account screen uses the same HTTPS origin with an exact `https://flash-hook.com/account.html` callback. Passwords have a 12-character minimum; signup requires email confirmation. Custom SMTP uses Resend with verified `flash-hook.com` and sender `accounts@flash-hook.com`.

`auth-config.js` contains only the public project URL and publishable key. SMTP and service credentials must never be committed or exposed in client code. A provider-verified user identifies the account screen; it does not grant paid features. The account session persists in this browser. Studio ideas and recordings remain local and are not attached to the account.

Nine local tests passed for registration, login/logout, generic error messages, resend, recovery, callback cleanup, and rejected unverified sessions. Deployment checks confirm the public form loads and connects. A real user's signup, delivered confirmation email, login, and recovery still require an end-to-end check after deployment.

Rollback: revert the authentication release commit to restore the prior coming-soon homepage. No studio storage keys or data tables are changed. Roll back if account forms cannot connect or callbacks fail; keep confirmation enabled and checkout disabled while resolving delivery issues.

## October 19, 2026 update

The existing four studios remain: **Music** (electric lime), **Comedy** (purple), **Creator** (sky blue), and **Venture** (gold). Creator covers social media, influencer content, and YouTube tutorials. Venture covers business ideas, pitches, and new ventures. Each studio now shows a short description so those mappings are clear. Custom studios receive a generic description.

Switching studios updates the brand accent, header border, studio label, selected studio button, capture controls, notice border, Settings gear, and focus outlines. The shared Idea Pool stays neutral, including its selected editor and save control. Saved ideas remain shared across studios.

All studio buttons wrap visibly on small screens. There is no redundant Studio dropdown. The upper-right Settings gear supports touch, keyboard activation, a visible focus indicator, a hover/focus tooltip, and the accessible name “Settings.” Its scrollable panel fits the viewport.

Settings offers seven named light accents and stores a separate selection per studio in this browser. Restore default colors resets only colors. Up to 20 custom studios can be added, with names up to 32 characters and no duplicates. They receive independent color settings; the palette repeats for later additions. Colors can be shared between studios.

## Existing capture and editor behavior

Quick Capture is an experimental, permission-gated microphone recorder already present in the live preview before this update. It offers a three-second countdown, cancellation, stop/save, browser playback, and recording downloads. Recordings stay in the device's IndexedDB and are not uploaded. Download important recordings immediately: browser storage may be cleared. Microphone/browser support varies; denial or unavailable storage produces a status message. This release preserves that recorder without claiming physical-phone microphone validation.

Audio import remains disabled and displays an explanatory notice. The capture-idea shortcut focuses the shared idea editor. Ideas save locally; Lyrics and Key Data Points retain drafts while switching studios/editors within a visit, but those two drafts do not persist through reload.

## Storage and privacy

Ideas retain the original `flashhook-public-preview-ideas-v1` key. Colors use `flashhook-public-preview-colors-v1`; custom studios use `flashhook-public-preview-categories-v1`; recordings use IndexedDB `flashhook-preview-recordings-v1`.

Settings and saved data stay on the current browser/device and origin. Clearing site data removes them. New visits open Music with its saved accent. Stored categories/colors are validated and user text renders as text, not HTML. Unreadable idea storage is not overwritten; unavailable storage produces a session-only warning.

## Verification and release

JavaScript syntax checked. Browser validation uses the public HTTPS page at 320 and 390 pixel mobile viewports: studio themes, neutral Idea Pool, Settings, independent colors retained through reload, restoring defaults, shared idea saving/reload, editor switching, and in-visit draft retention. All seven accents use light colors against dark surfaces; labels and focus indicators remain visible. Browser viewport checks do not replace a physical-device or screen-reader test.

This update preserves the newer gear UI, Creator/Venture studios, and local recorder found on the live branch. No private repository was copied or published. Only this README and the standalone public HTML are part of this release.

Deploy the repository root from `main` through the existing GitHub Pages build; no dependencies are required. Confirm the Pages Actions run succeeds and the public page shows the Creator/Venture descriptions. If loading, switching, or idea saving regresses, revert the interface commit and let Pages redeploy. Separate storage keys preserve saved ideas during an interface rollback.

To disable hosting, use repository **Settings → Pages → Branch → None → Save**; that does not delete the public repository.

## Music sequencer and shared Settings

AI provider information now lives on `settings.html`, reachable from the workshop gear. Provider connections remain disabled and marked coming soon. Internal partner/research notes are not displayed as customer controls.

Music includes a four-track, 16-step sequencer with synthesized kick, snare, hi-hat and clap, tempo (40–240 BPM), volume, presets, moving playhead and local pattern persistence. Save beat to Idea Pool writes a text pattern without losing an existing idea draft. Playback stops on studio switches, hidden tabs, and page exit. The sequencer appears only in Music.

Validated locally: step editing and reload persistence, moving playhead, stop-on-studio-switch, save to Idea Pool, Settings navigation, and 390px layout without page overflow (the step grid scrolls horizontally). No microphone recording or real-device audio test was performed. Existing recording, idea storage, themes and storyboarding remain in place. Roll back this release if those flows regress.

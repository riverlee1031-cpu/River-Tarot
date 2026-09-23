# RIVER TAROT v1.9 · UPDATE 09

Retro 90s / CRT four-card relationship tarot web app.

## Deploy to GitHub Pages
1. Upload every file and folder in this package to the root of the `River-Tarot` repository.
2. GitHub → Settings → Pages.
3. Source: `Deploy from a branch`.
4. Branch: `main`, folder: `/ (root)`.
5. Open: https://riverlee1031-cpu.github.io/River-Tarot/

## Main files
- `index.html` — interface
- `style.css` — retro UI / responsive design
- `app.js` — topic selection, 78-card spread, 4-card relationship draw, upright/reversed logic, combination reading engine, varied three-step advice, ChatGPT handoff, sharing, and audio controls
- `tarot.json` — 78-card data
- `cards/` — tarot images
- `assets/river-night-drive.mp3` — background music

## Update link
The footer points to:
https://github.com/riverlee1031-cpu/River-Tarot


## v1.6 UPDATE 06
- Fixed action advice rendering.
- Pre-generates share image for more reliable iPhone Web Share / Instagram handoff.
- Falls back to image download when direct share is unavailable.
- Added dedicated mobile reading layout.

## v1.9 UPDATE 09
- Keeps the ME / THEM / CURRENT DYNAMIC / ADVICE four-card spread and all existing media, mobile, ChatGPT and sharing features.
- Adds a short plain-language explanation for every upright or reversed card based on the traditional 78-card meaning.
- Expands the combined reading across card positions, orientations, Major Arcana count and suit balance.
- Generates three practical, lightly humorous action steps that vary by topic, card mix and advice card.
- Adds a lightweight four-card reveal animation with staggered entrance, flip, lift and a short mystic glow.

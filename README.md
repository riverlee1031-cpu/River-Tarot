# RIVER TAROT v1.12 · Live AI preparation

本分支已改成即時 AI 解牌，需要 OpenAI API 金鑰與 Node 後端才能啟用。尚未完成真實模型驗證，尚未取代線上版本。

完整啟用步驟見 [SETUP-AI.md](SETUP-AI.md)。本機啟動：`node --env-file-if-exists=.env server/index.cjs`；測試：`node --test tests/reading.test.cjs`。

- `server/reading.cjs`：RIVER 解牌指引、完整問題與牌組輸入、Structured Outputs、輸出驗證。
- `server/index.cjs`：私密 API 金鑰、HTTP 服務、公開檔案白名單、單實例限流。
- `reading-client.js`：非同步請求、取消、去重、錯誤與結果驗證。
- `runtime-config.js`：公開後端網址設定，不能放金鑰。
- `tests/reading-evals.json`：真實模型品質驗收案例。

目前已移除站內規則式情境分析。AI 尚未設定或失敗時只顯示基本牌義和明確錯誤，不會替補成假 AI 結果。GitHub Pages 仍可承載前端，但無法單獨執行 Node 後端。

---

以下為舊版紀錄與既有網站資料。

# RIVER TAROT v1.11 · UPDATE 11

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
- Produces a clear, lightly humorous combined reading and a single focused conclusion without a separate action-advice list.
- Adds a lightweight four-card reveal animation with staggered entrance, flip, lift and a short mystic glow.
- Adds a short result-page transition and icon-led labels for redraw, ChatGPT, sharing and starting a new question.


## v1.11 · RIVER contextual readings
- `reading-engine.js` applies original editorial rules: card meaning, position, topic context, and a practical response. Both orientations are classified independently.
- Work, relationship, money and general spreads use appropriate position labels. New-job and restaurant questions receive focused work context when explicitly present.
- Conclusions combine card themes rather than treating upright/reversed counts as success scores. Details, result text and sharing use the same engine.
- Removed the MOFA source requirement. The ChatGPT handoff follows the same interpretation style without requesting an external meaning website.
- The site remains an offline, curated rule engine. It does not call an AI service or fully understand arbitrary questions; the ChatGPT button supports deeper free-form interpretation.
- Check with `node scripts/check-readings.cjs` and `node --check app.js`.

# 啟用 RIVER 即時 AI 解牌

新版已寫好，但目前尚未接入真實 API，也尚未取代線上版本。程式在 `codex/live-ai-readings` 分支。

玩家輸入的完整問題、主題、四張牌的標準名稱、牌陣位置及正逆位，會交給 OpenAI Responses API。AI 用自己的塔羅知識逐張解釋，再綜合回答問題。站內不再用關鍵字句庫生成情境分析，也不再引用指定牌義網站。

這能使用我們確認的解讀風格，但不能把這個聊天中的模型本身複製進網站，也不能保證每次回答與聊天完全一致。最後品質仍需在你選用的模型上實測。

## 1. 準備 OpenAI API

在 [OpenAI API 平台](https://platform.openai.com/)建立專案，啟用 API 計費，建立 API key。金鑰只填在下述主機的環境變數，不要貼在聊天、前端程式或 GitHub。

`OPENAI_MODEL` 需填入你的 API 專案可用、支援 Responses API 與 Structured Outputs 的模型 ID。範例使用官方文字生成文件中的 `gpt-6-astra`；能否使用仍以你的 API 專案權限為準。

## 2. 部署 Node 後端（以 Render 為例）

1. 在 [Render](https://dashboard.render.com/)登入，選 **New → Web Service**，連接 `riverlee1031-cpu/River-Tarot`。
2. 分支選 `codex/live-ai-readings`，執行環境選 Node。使用 Node 22.9 以上（例如 24）。
3. Build Command 填 `node --check server/index.cjs`，Start Command 填 `node server/index.cjs`。程式沒有第三方套件依賴。
4. 建立時或在 **Environment** 填入：
   - `OPENAI_API_KEY`：你剛建立的金鑰。
   - `OPENAI_MODEL`：可用的模型 ID，例如 `gpt-6-astra`。
   - `NODE_ENV`：`production`。
   - `ALLOWED_ORIGINS`：先填 `https://riverlee1031-cpu.github.io`。取得 Render 網址後，再加入該網址的 origin，以逗號分隔。例如 `https://riverlee1031-cpu.github.io,https://你的服務.onrender.com`。不要加 `/River-Tarot/` 路徑或結尾斜線。
   - `MAX_DAILY_READINGS`：可先填 `20`，限制這個服務實例每天發出的解牌請求。
5. 選擇適合的主機方案後部署；方案與 API 都由你自行啟用及計費。取得網址後，更新 `ALLOWED_ORIGINS` 並重新部署。

同一個 Node 服務也會提供完整網頁，因此可以先在 Render 網址測試抽牌和 AI 結果，不用立即更動 GitHub Pages。

官方操作參考：[Node 部署](https://render.com/docs/deploy-node-express-app)、[環境變數](https://render.com/docs/configure-environment-variables)。

## 3. 接回原本 RIVER 網址

在 `runtime-config.js` 將空的 `readingEndpoint` 改成已部署的 API 網址：

```js
window.RIVER_CONFIG = {
  readingEndpoint: 'https://你的服務.onrender.com/api/reading'
};
```

測試成功後，將這個分支合併到 `main` 並推送。GitHub Pages 會更新前端，真正的 AI 請求由 Node 後端處理。此檔只能放公開網址，不能放金鑰。

若只使用 Render 網址，就保留空字串，不必設定跨站 endpoint。

## 4. 上線前確認

- `/api/health` 顯示 `{"ready":true}` 只表示金鑰與模型變數已填入，不代表金鑰、餘額或模型權限一定有效。
- 實際抽四張牌，確認逐張解讀與結論會完成。按同一張牌不應重複扣次數。
- 用同一組牌測試「新工作適應」「與主管談調班」「感情互動」等不同問題；確認回答針對問題，而不是只換名詞。評讀範例見 `tests/reading-evals.json`。
- 服務失敗時應顯示錯誤及「重新解讀這組牌」；不會自動拿固定句子冒充 AI 結果。
- 重新抽牌後，舊請求的結果不會覆蓋新牌組；分享使用已完成的同一份解讀。

程式不記錄問題內容，也不把金鑰送給瀏覽器。API 請求設定 `store:false`，但這不等於提供者完全不保留任何資料；仍需依 OpenAI 的資料政策使用。玩家提問欄已提示資料會交給 OpenAI。

目前防濫用是**單一 Node 實例**的每分鐘 10 次、同時 3 次，以及每日請求數限制。每日計數依 UTC，會在程序重啟時歸零。CORS 不是身分驗證，這些限制也不是硬性的費用上限。公開推廣或擴展多實例前，應接入共享持久化限流與機器人驗證；API 專案仍需自行設定及查看用量。

## 本機測試

1. 將 `.env.example` 複製成 `.env`，在本機編輯器填入金鑰和模型。
2. 執行 `node --env-file-if-exists=.env server/index.cjs`。
3. 開啟 `http://localhost:3000`。
4. 執行 `node --test tests/reading.test.cjs`。自動測試使用模擬 API，不會產生 API 費用，也不代表真實模型的解牌品質已驗證。

實作參考：[OpenAI 文字生成](https://developers.openai.com/api/docs/guides/text)、[Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)。

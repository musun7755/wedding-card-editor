# 結婚卡模板編輯器

開啟 [線上編輯器](https://musun7755.github.io/wedding-card-editor/) 即可編輯文字、照片、版型、底部圖案，並下載 PNG。卡片內容在瀏覽器內處理，不需上傳照片到伺服器。

## 本機預覽

在此資料夾執行：

```sh
python -m http.server 8765
```

然後開啟 `http://localhost:8765/`。字型由 `assets/fonts/` 載入，不需手動選取字型檔。

## GitHub Pages

發布來源設定為 `main` 分支的 `/(root)`。每次推送到 `main` 後，GitHub Pages 會發布根目錄的 `index.html` 與 `assets/fonts/`。

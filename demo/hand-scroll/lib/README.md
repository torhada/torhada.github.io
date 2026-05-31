# lib/ — MediaPipe ローカルファイル

Chrome 拡張の MV3 では外部 CDN のスクリプトを直接読み込めないため、
MediaPipe Tasks Vision のファイルをここに配置する必要があります。

## セットアップ手順（PowerShell）

```powershell
# このフォルダ（gesture_chrome_app/lib/）に移動してから実行
$base = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10"

# メインバンドル
Invoke-WebRequest "$base/vision_bundle.mjs" -OutFile "vision_bundle.mjs"

# WASM ファイル（4ファイル）
foreach ($f in @(
  "vision_wasm_internal.js",
  "vision_wasm_internal.wasm",
  "vision_wasm_nosimd_internal.js",
  "vision_wasm_nosimd_internal.wasm"
)) {
  Invoke-WebRequest "$base/wasm/$f" -OutFile "wasm\$f"
}
```

完了後のフォルダ構成：

```
lib/
├── vision_bundle.mjs
└── wasm/
    ├── vision_wasm_internal.js
    ├── vision_wasm_internal.wasm
    ├── vision_wasm_nosimd_internal.js
    └── vision_wasm_nosimd_internal.wasm
```

モデルファイル（gesture_recognizer.task）は起動時に
Google Storage から自動ダウンロードされます（約25 MB、キャッシュされます）。

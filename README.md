# Portfolio — HARUTO

「Refined Minimalism」デザインシステム（`DESIGN.md`）に沿った個人ポートフォリオサイト。
エンジニア / ML リサーチャー（愛知県）向けの内容。

## ファイル構成

| ファイル | 内容 |
|----------|------|
| `index.html` | トップ（ヒーロー / What I do / Selected Works / CTA） |
| `works.html` | 実績一覧（Research / App / Extension / LP のフィルタ + グリッド） |
| `about.html` | 自己紹介 / 経歴（情報工学 → CV・VLM 研究 → PoC 開発）/ スキル / 連絡先 |
| `assets/config.js` | Tailwind 設定（色・タイポグラフィ・余白）※全ページ共通 |
| `assets/main.js` | 画像ホバー・スクロール演出など ※全ページ共通 |
| `code.html` | 元のプロジェクト詳細ページのテンプレート（作品詳細を作るときの雛形に使えます） |
| `DESIGN.md` | デザインシステム定義 |

## 見るには

各 HTML をブラウザで開くだけ（ビルド不要、Tailwind は CDN）。

## あとで差し替える箇所

- **名前 / ブランド**: 全ページの `HARUTO`、フッターの著作権表記
- **実績**: `index.html` の Selected Works と `works.html` のカード。`picsum.photos` のダミー画像を実際のスクショ等に、タイトル・カテゴリ・`Coming` の表記を実データに置き換え
  - 研究実績（論文・学会発表）、自動化アプリ、Chrome 拡張機能を追加予定
- **プロフィール文 / 経歴 / スキル**: `about.html`（経歴は年号ではなく「大学 / 大学院 / 現在」の段階表記。必要なら年号や学校名・社名に差し替え）
- **連絡先**: `about.html` の `mailto:`（現在 `haruto160817@gmail.com`）と各ページフッターの SNS リンク（現在 `#`。GitHub / X / LinkedIn）
- **作品詳細ページ**: `code.html` を複製して各プロジェクト用ページにできます（カードの `href="#"` をそのファイルに向ける）

## デザインを変えたいとき

色やフォントサイズは `assets/config.js` を編集すれば全ページに反映されます。

# GTM・GA4 研修キット — STYLE DEMO

WEB広告代理店の新入社員向け、GTM・GA4ハンズオン研修用テストサイトです。

## 研修のゴール

この研修を終えると以下ができるようになります：

- GTMにGA4タグを設置し、プレビューで発火確認できる
- ページビュー・クリック・フォーム送信・スクロール・タイマーなど代表的なトリガーを設定できる
- dataLayer変数を使ってカスタムイベントのパラメータをGA4に渡せる
- GA4のリアルタイム・イベント・コンバージョンレポートで計測結果を確認できる
- URLが変わらないLP型フォームのCV計測（実務頻出）ができる

## 研修の全体像（半日）

| ステップ | 内容 | 時間 |
|---------|------|------|
| レクチャー① | [GA4・GTMの基礎知識](docs/00_what_is_ga4_gtm.md) | 30分 |
| レクチャー② | [GTM・GA4の環境構築](docs/01_setup.md) | 40分 |
| ハンズオン | [課題1〜7に取り組む](docs/02_exercises.md) | 2時間 |
| まとめ | [GA4レポート確認 + 振り返り](docs/03_ga4_reports.md) | 20分 |
| 振り返り | [自己チェックリスト](docs/04_summary.md) | 研修後 |

**合計：約3時間30分**

---

## デプロイ手順（最初の1回だけ）

### 1. コンテナIDを書き換える

全HTMLファイルの `GTM-XXXXXXX` をあなたのコンテナIDに一括置換します。

**VS Codeの場合：**
- `Cmd+Shift+H` → 検索: `GTM-XXXXXXX` → 置換: `GTM-あなたのID`

置換後、再度 `GTM-XXXXXXX` で検索して0件になっていることを確認してください。

### 2. GitHub Pagesにデプロイ

```bash
cd ~/Desktop/GTM
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/あなたのID/gtm-demo-site.git
git push -u origin main
```

GitHubリポジトリ → Settings → Pages → Branch: `main` / `/ (root)` → Save

数分〜10分後に `https://あなたのID.github.io/gtm-demo-site/` でアクセス可能。

---

## サイト構成

| ファイル | 内容 | 練習できる主なトリガー |
|---------|------|---------------------|
| `index.html` | トップ（ヒーロー、注目商品、外部リンク） | クリック、外部リンク離脱 |
| `products.html` | 商品一覧（カテゴリフィルター） | クリック、スクロール |
| `product.html` | 商品詳細（サイズ選択、カート追加） | クリック、dataLayerイベント、スクロール |
| `cart.html` | カート（数量変更、削除） | ページビュー |
| `thanks.html` | 購入完了 | **ページビュー（URL条件付き）CV計測** |
| `contact.html` | お問い合わせフォーム | **フォーム送信、タイマー** |
| `form_lp.html` | BtoBリード獲得LP（TimeSync） | **カスタムイベント（LP型CV）** |

```
assets/
  style.css    スタイルシート
  app.js       JavaScript（dataLayer push含む）
docs/
  00_what_is_ga4_gtm.md   レクチャー①：GA4・GTM基礎 + UTM基礎
  01_setup.md             レクチャー②：環境構築（GTM公開まで）
  02_exercises.md         ハンズオン課題（全7本）
  03_ga4_reports.md       GA4レポートの見方
  04_summary.md           まとめ・振り返り・自己チェックリスト
```

---

## 課題一覧

| # | トリガー種別 | 計測シナリオ |
|---|------------|------------|
| 1 | ページビュー（全ページ） | 全ページのGA4基本計測 |
| 2 | ページビュー（URL条件付き） | 購入完了ページのCV計測 |
| 3 | クリック + カスタムイベント + dataLayer変数 | カートに追加クリック・商品情報の取得 |
| 4 | クリック - リンクのみ | 外部リンク離脱クリック計測 |
| 5 | スクロール距離 | 商品詳細ページ 50%スクロール |
| 6-A | フォーム送信 | お問い合わせCVの計測 |
| 6-B | タイマー | 30秒滞在の計測 |
| 7 | カスタムイベント（LP型） | URLが変わらないLP型CV計測 |

---

## 前提条件

- Googleアカウント（GA4・GTM作成に必要）
- GitHubアカウント（デプロイに必要）
- ブラウザのDevTools（F12）が使えること
- Gitの基本コマンドが使えること（不安な方はdocs/01_setup.mdに補足あり）

特別なソフトウェアのインストールは不要です。

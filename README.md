# ナカシマ工房 公式サイト

家具職人によるオーダーメイド家具のコーポレートサイト。

---

## ファイルをパソコンに保存してVSコードで開く手順

### ① GitHubからファイルをダウンロードする

1. ブラウザで https://github.com/Hirano-kaishin/nakashima-kobo を開く
2. 緑色の「**Code**」ボタンをクリック
3. 「**Download ZIP**」をクリック
4. ZIPファイルがダウンロードされる
5. ダウンロードされたZIPファイルを**右クリック →「すべて展開」**
6. 展開先を**デスクトップ**に指定して「展開」をクリック
7. デスクトップに `nakashima-kobo-main` フォルダが作成される

### ② VSコードで開く

1. デスクトップの `nakashima-kobo-main` フォルダを**VSコードのアイコンにドラッグ＆ドロップ**
2. VSコードが起動してフォルダが開く

### または：VSコードから直接クローンして開く（Git使える人向け）

1. VSコードを起動
2. VSコード上部の検索バーに `>git clone` と入力してEnter
3. `https://github.com/Hirano-kaishin/nakashima-kobo.git` を貼り付けてEnter
4. 保存先にデスクトップを選択
5. 「開く」をクリック

---

## ディレクトリ構成

```
nakashima-kobo/
├── index.html          # メインHTML
├── css/
│   ├── style.css       # メインスタイル
│   └── animations.css  # アニメーション
├── js/
│   └── main.js         # JavaScriptロジック
├── images/             # 画像フォルダ（後で追加）
│   └── .gitkeep
└── README.md
```

## ページ構成

- **ヒーロー** - キャッチコピー + CTA
- **統計** - 制作実績・職人経験・オーダーメイド率
- **職人の話 (About)** - 職人プロフィール・こだわり
- **こだわり (Features)** - 国産無垢材・完全オーダーメイド・丁寧な仕上げ
- **ギャラリー** - 制作実績（フィルター機能付き）
- **制作の流れ (Process)** - 4ステップ
- **Instagram連携**
- **お問い合わせフォーム**

## 画像の追加方法

`images/` フォルダに以下の画像を追加してください：

- `craftsman.jpg` - 職人写真（About セクション）
- `gallery-01.jpg` ～ `gallery-06.jpg` - ギャラリー写真
- `og-image.jpg` - OGP画像（1200×630px推奨）

HTML内の該当箇所の `<svg placeholder>` を `<img src="images/xxx.jpg" alt="...">` に差し替えてください。

## デザインコンセプト

**和モダン × ダークラグジュアリー**

- カラー：ダークブラウン地 + ゴールドアクセント
- フォント：明朝体（Shippori Mincho）+ Noto Sans JP
- 雰囲気：40代男性職人、上質・落ち着き・手仕事感

## 技術仕様

- 純粋なHTML / CSS / JavaScript（フレームワーク不使用）
- Google Fonts（Shippori Mincho, Zen Old Mincho, Noto Sans JP）
- IntersectionObserver APIによるスクロールアニメーション
- フォームバリデーション実装済み（送信先はFormspree等に別途設定）

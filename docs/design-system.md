# デザインシステム

学習タスク管理アプリのデザインシステムドキュメント

## カラーパレット

### プライマリカラー（Primary）
GitHub風のダークブルー/ネイビー系を採用

- `primary-50` ~ `primary-950`: プライマリカラーの階層
- `primary-950` (#0d1117): GitHub風のダークブルー（メインカラー）

### アクセントカラー（Accent）
CTAボタンや重要なアクションに使用

- `accent-50` ~ `accent-900`: アクセントカラーの階層
- `accent-500` (#22c55e): メインのアクセントカラー

### ステータスカラー

#### Success（成功）
- `success-50`, `success-100`, `success-500`, `success-600`
- 完了状態、成功メッセージに使用

#### Warning（警告）
- `warning-50`, `warning-100`, `warning-500`, `warning-600`
- 注意が必要な状態に使用

#### Error（エラー）
- `error-50`, `error-100`, `error-500`, `error-600`
- エラー状態、期限切れに使用

#### Info（情報）
- `info-50`, `info-100`, `info-500`, `info-600`
- 情報表示、進行中状態に使用

## タイポグラフィ

### フォントファミリー

- **Sans**: システムフォントスタック（-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto等）
- **Mono**: 等幅フォント（コード表示用）

### 見出し階層

- `text-3xl font-bold`: ページタイトル
- `text-2xl font-semibold`: セクションタイトル
- `text-xl font-semibold`: サブセクションタイトル
- `text-lg font-medium`: カードタイトル
- `text-base`: 本文
- `text-sm`: 補助テキスト
- `text-xs`: 小さなラベル

## スペーシング

Tailwindの標準スペーシングに加えて、以下を追加：

- `spacing-18`: 4.5rem
- `spacing-88`: 22rem
- `spacing-128`: 32rem

## シャドウ

- `shadow-sm`: 小さなシャドウ
- `shadow`: デフォルトシャドウ
- `shadow-md`: 中程度のシャドウ
- `shadow-lg`: 大きなシャドウ
- `shadow-xl`: 非常に大きなシャドウ
- `shadow-2xl`: 最大のシャドウ

## ボーダー

- `rounded-md`: デフォルトの角丸（0.375rem）
- `rounded-lg`: 大きな角丸（0.5rem）
- `rounded-xl`: 非常に大きな角丸（0.75rem）
- `rounded-2xl`: 最大の角丸（1rem）

## コンポーネント

### Button

**バリアント:**
- `primary`: プライマリアクション（デフォルト）
- `secondary`: セカンダリアクション
- `outline`: アウトラインスタイル
- `text`: テキストボタン

**サイズ:**
- `sm`: 小さなボタン
- `md`: 中程度のボタン（デフォルト）
- `lg`: 大きなボタン

**使用例:**
```tsx
<Button variant="primary" size="md">保存</Button>
<Button variant="outline" size="sm">キャンセル</Button>
```

### Card

情報を表示するためのカードコンポーネント

**スロット:**
- `CardHeader`: ヘッダー部分
- `CardBody`: 本文部分
- `CardFooter`: フッター部分

**使用例:**
```tsx
<Card hover onClick={handleClick}>
  <CardHeader>タイトル</CardHeader>
  <CardBody>コンテンツ</CardBody>
  <CardFooter>フッター</CardFooter>
</Card>
```

### Badge

ステータスやラベルを表示

**バリアント:**
- `success`: 成功状態
- `warning`: 警告状態
- `error`: エラー状態
- `info`: 情報状態
- `default`: デフォルト

**使用例:**
```tsx
<Badge variant="success">完了</Badge>
<Badge variant="error">期限切れ</Badge>
```

### Input / Textarea / Select

フォーム入力コンポーネント

**機能:**
- ラベル表示
- エラーメッセージ表示
- ヘルパーテキスト表示
- バリデーション状態の視覚的フィードバック

**使用例:**
```tsx
<Input
  label="科目名"
  error={errors.name}
  helperText="科目名を入力してください"
  required
/>
```

### Modal

モーダルダイアログコンポーネント

**機能:**
- ESCキーで閉じる
- オーバーレイクリックで閉じる（オプション）
- フォーカストラップ
- アニメーション

**使用例:**
```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="確認"
  size="md"
>
  コンテンツ
</Modal>
```

### Toast

通知表示コンポーネント

**タイプ:**
- `success`: 成功メッセージ
- `error`: エラーメッセージ
- `warning`: 警告メッセージ
- `info`: 情報メッセージ

**使用例:**
```tsx
const { showToast } = useToast()
showToast('保存しました', 'success')
```

### ProgressBar

進捗表示コンポーネント

**機能:**
- 進捗率の視覚化（0-100%）
- 進捗に応じた自動カラー変更
- ラベル表示（オプション）

**使用例:**
```tsx
<ProgressBar value={75} showLabel variant="success" />
```

### DateDisplay

日付表示コンポーネント

**フォーマット:**
- `relative`: 相対時間表示（"1時間前"、"昨日"など）
- `absolute`: 絶対日時表示
- `both`: 両方表示

**使用例:**
```tsx
<DateDisplay date={new Date()} format="relative" />
```

### StatusBadge

タスクステータス表示用バッジ

**ステータス:**
- `completed`: 完了
- `in_progress`: 進行中
- `not_started`: 未着手
- `overdue`: 期限切れ

**使用例:**
```tsx
<StatusBadge status="completed" showIcon />
```

### TaskCard / SubjectCard

データ表示用のカードコンポーネント

タスクや科目の情報を表示するための専用カードコンポーネント

## レイアウトコンポーネント

### Container

コンテンツ幅を制限するコンテナ

**最大幅:**
- `sm`, `md`, `lg`, `xl`, `2xl`, `full`

### Header

アプリケーションヘッダー

### Navigation

サイドバーナビゲーション

## アイコン

`lucide-react`を使用

よく使うアイコンは `components/icons/index.ts` からエクスポート

## アクセシビリティ

すべてのコンポーネントは以下のアクセシビリティ要件を満たしています：

- ARIA属性の適切な使用
- キーボードナビゲーション対応
- フォーカス管理
- スクリーンリーダー対応

## レスポンシブデザイン

モバイルファーストのアプローチを採用

- ブレークポイント: Tailwindの標準ブレークポイントを使用
- グリッドシステム: FlexboxとGridを活用


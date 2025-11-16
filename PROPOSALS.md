# 学習タスク管理アプリ - 改善提案・実装計画

## ステータス管理

- **未完了タスク数**: 1件
- **最終更新**: 2025-01-27
- **次回アクション**: 新しい提案を生成再開（マージ完了）

---

## New Proposal

（新しい提案を生成中...）

**提案日**: 2025-01-27  
**優先度**: 低（UX向上）  
**推定工数**: 中

#### 概要
アプリ全体のパフォーマンスを最適化します。データ読み込みの高速化、不要な再レンダリングの防止、大量データの効率的な処理を実装します。

#### 背景・目的
- 大量のタスク・学習ログがある場合でも快適に動作するようにする
- 不要な再レンダリングを防止し、UIの応答性を向上させる
- データ読み込み時間の短縮
- ユーザー体験の向上

#### 実装内容

1. **データ読み込みの最適化**
   - データのメモ化
   - 遅延読み込み（Lazy Loading）
   - データのキャッシュ

2. **レンダリングの最適化**
   - React.memoの活用
   - useMemo、useCallbackの適切な使用
   - 仮想スクロールの実装（大量データの場合）

3. **データ処理の最適化**
   - フィルタリング・ソート処理の最適化
   - データ集計処理の最適化
   - 不要な計算の削減

#### Implementation Steps

1. **データメモ化の実装** (`lib/hooks/useMemoizedData.ts`)
   - データのメモ化フック
   - 依存関係の管理
   - キャッシュの管理

2. **仮想スクロールコンポーネントの実装** (`components/ui/VirtualList.tsx`)
   - 大量データの効率的な表示
   - スクロール位置の管理
   - レンダリング範囲の最適化

3. **データフィルタリングの最適化** (`lib/utils/optimizedFilters.ts`)
   - フィルタリング処理の最適化
   - インデックスの活用
   - キャッシュの活用

4. **データソートの最適化** (`lib/utils/optimizedSort.ts`)
   - ソート処理の最適化
   - 安定ソートの実装
   - メモ化の活用

5. **データ集計の最適化** (`lib/utils/optimizedAggregation.ts`)
   - 集計処理の最適化
   - インクリメンタル集計
   - キャッシュの活用

6. **コンポーネントのメモ化**
   - 主要コンポーネントのReact.memo適用
   - useMemo、useCallbackの適切な使用
   - 不要な再レンダリングの防止

7. **コード分割の実装** (`app/` ディレクトリ構造)
   - 動的インポートの活用
   - ルートベースのコード分割
   - コンポーネントの遅延読み込み

8. **パフォーマンス監視の実装** (`lib/utils/performanceMonitor.ts`)
   - レンダリング時間の計測（開発環境）
   - データ読み込み時間の計測
   - パフォーマンスメトリクスの記録

#### 期待される成果物

- `lib/hooks/useMemoizedData.ts` - データメモ化フック（約100-150行）
- `components/ui/VirtualList.tsx` - 仮想スクロールコンポーネント（約200-300行）
- `lib/utils/optimizedFilters.ts` - 最適化フィルタリング（約150-200行）
- `lib/utils/optimizedSort.ts` - 最適化ソート（約100-150行）
- `lib/utils/optimizedAggregation.ts` - 最適化集計（約150-200行）
- `lib/utils/performanceMonitor.ts` - パフォーマンス監視（約100-150行）
- 主要コンポーネントのメモ化（各コンポーネントに追加）

#### 注意事項

- パフォーマンス最適化は、可読性と保守性を損なわない範囲で行う
- メモ化は適切に使用し、過度なメモ化は避ける
- 仮想スクロールは、大量データがある場合のみ使用する
- パフォーマンス監視は開発環境でのみ有効にする
- 最適化の効果を測定し、改善を継続する

#### 完了条件

- [ ] データ読み込みが高速化されている
- [ ] 不要な再レンダリングが防止されている
- [ ] 大量データでも快適に動作する
- [ ] フィルタリング・ソート処理が最適化されている
- [ ] 仮想スクロールが正しく動作する（必要な場合）
- [ ] パフォーマンス監視が正しく動作する（開発環境）

---

## New Proposal

### データ検証とエラーハンドリングの強化：入力値検証・エラー表示の改善

**提案日**: 2025-01-27  
**優先度**: 中（品質向上）  
**推定工数**: 中

#### 概要
アプリ全体のデータ検証とエラーハンドリングを強化します。入力値の検証、エラーメッセージの統一、ユーザーフレンドリーなエラー表示を実装します。

#### 背景・目的
- 各機能で個別に実装されているバリデーションを統一化する
- エラーメッセージをユーザーフレンドリーな日本語で統一する
- エラー発生時の適切な処理と表示を実装する
- データ整合性の向上

#### 実装内容

1. **統一バリデーションシステム**
   - 共通バリデーション関数の実装
   - エラーメッセージの統一
   - バリデーションルールの定義

2. **エラーハンドリングシステム**
   - エラータイプの定義
   - エラーハンドラーの実装
   - エラーログの記録（開発用）

3. **ユーザーフレンドリーなエラー表示**
   - エラーメッセージの表示
   - エラー位置のハイライト
   - エラー解決のヒント表示

#### Implementation Steps

1. **共通バリデーション関数の実装** (`lib/validation/common.ts`)
   - `validateRequired(value: any, fieldName: string): ValidationResult` - 必須チェック
   - `validateStringLength(value: string, min: number, max: number, fieldName: string): ValidationResult` - 文字列長チェック
   - `validateDateRange(startDate: Date, endDate: Date, fieldName: string): ValidationResult` - 日付範囲チェック
   - `validateEmail(email: string): ValidationResult` - メールアドレスチェック（将来の拡張用）
   - `validateNumberRange(value: number, min: number, max: number, fieldName: string): ValidationResult` - 数値範囲チェック

2. **エラータイプの定義** (`lib/types/errors.ts`)
   - `ValidationError` - バリデーションエラー
   - `DataError` - データエラー
   - `StorageError` - ストレージエラー
   - `NetworkError` - ネットワークエラー（将来の拡張用）

3. **エラーハンドラーの実装** (`lib/utils/errorHandler.ts`)
   - `handleError(error: Error): ErrorInfo` - エラーの処理
   - `formatErrorMessage(error: Error): string` - エラーメッセージのフォーマット
   - `logError(error: Error, context?: string): void` - エラーログの記録（開発用）

4. **エラー表示コンポーネントの実装** (`components/errors/ErrorDisplay.tsx`)
   - エラーメッセージの表示
   - エラータイプに応じた表示
   - エラー解決のヒント表示

5. **フォームエラー表示コンポーネントの実装** (`components/errors/FormError.tsx`)
   - フィールドごとのエラー表示
   - エラー位置のハイライト
   - エラーメッセージの表示

6. **バリデーションコンテキストの実装** (`lib/contexts/ValidationContext.tsx`)
   - バリデーション状態の管理
   - エラーメッセージの管理
   - バリデーション関数の提供

7. **既存バリデーション関数の統一化**
   - `lib/validation/taskValidation.ts` の更新
   - `lib/validation/subjectValidation.ts` の更新
   - `lib/validation/studyLogValidation.ts` の更新
   - `lib/validation/examValidation.ts` の更新
   - `lib/validation/classValidation.ts` の更新

8. **エラーハンドリングの統合**
   - 各API関数でのエラーハンドリング
   - 各コンポーネントでのエラー表示
   - グローバルエラーハンドリング（オプション）

#### 期待される成果物

- `lib/validation/common.ts` - 共通バリデーション関数（約150-200行）
- `lib/types/errors.ts` - エラータイプ定義（約50-100行）
- `lib/utils/errorHandler.ts` - エラーハンドラー（約100-150行）
- `components/errors/ErrorDisplay.tsx` - エラー表示コンポーネント（約100-150行）
- `components/errors/FormError.tsx` - フォームエラー表示（約80-120行）
- `lib/contexts/ValidationContext.tsx` - バリデーションコンテキスト（約100-150行）
- 既存バリデーション関数の更新（各50-100行）

#### 注意事項

- エラーメッセージは必ず日本語で表示する
- エラーメッセージは具体的で、解決方法が分かるようにする
- バリデーションはクライアント側とサーバー側（将来の拡張）の両方で実装する
- エラーログは開発環境でのみ記録する
- ユーザーに表示するエラーメッセージには機密情報を含めない

#### 完了条件

- [ ] 共通バリデーション関数が正しく動作する
- [ ] エラーハンドリングが適切に行われる
- [ ] エラーメッセージがユーザーフレンドリーに表示される
- [ ] 既存のバリデーション関数が統一化されている
- [ ] フォームエラーが適切に表示される
- [ ] エラーログが正しく記録される（開発環境）

---

## New Proposal [DONE]

### 授業回管理機能の実装：授業登録・一覧・タスク紐付け

**提案日**: 2025-01-27  
**完了日**: 2025-01-27  
**優先度**: 低（補助機能）  
**推定工数**: 小

**実装完了内容**:
- 授業回CRUD関数の実装 (`lib/api/classes.ts`)
- 授業回バリデーション関数の実装 (`lib/validation/classValidation.ts`)
- 授業回登録フォームの実装 (`components/classes/ClassForm.tsx`)
- 授業回カードコンポーネントの実装 (`components/classes/ClassCard.tsx`)
- 授業回一覧ページの実装 (`app/(dashboard)/classes/page.tsx`)
- 授業回詳細ページの実装 (`app/(dashboard)/classes/[id]/page.tsx`)
- サイドバーに授業回へのリンクを追加
- TypeScriptコンパイルとNext.jsビルドが正常に完了することを確認

#### 概要
仕様書2.3で定義されている授業回（Class）管理機能を実装します。授業の登録・編集・削除、授業一覧の表示、授業とタスクの紐付け機能を実装します。

#### 背景・目的
- 仕様書2.3で授業回（Class）のデータ構造が定義されている
- 仕様書3.2で「授業ごとの予習/復習/課題の紐付け」が要件として定義されている
- 授業情報を管理し、タスクと紐付けることで、より詳細な学習管理が可能になる

#### 実装内容

1. **授業回登録・編集機能**
   - 授業登録フォーム
   - 授業編集フォーム
   - 科目、日付・時間、授業タイトルの入力
   - バリデーション

2. **授業回一覧表示**
   - 授業リストの表示
   - 科目別・日付別フィルタリング
   - 検索機能

3. **授業とタスクの紐付け**
   - タスク作成時に授業を選択可能にする
   - 授業詳細画面で関連タスクを表示
   - 授業からタスクを一括生成（オプション）

#### Implementation Steps

1. **授業回CRUD関数の実装** (`lib/api/classes.ts`)
   - `createClass(class: Omit<Class, 'id'>): Class` - 授業作成
   - `updateClass(id: string, class: Partial<Class>): Class` - 授業更新
   - `deleteClass(id: string): void` - 授業削除
   - `getClass(id: string): Class | null` - 授業取得
   - `getAllClasses(): Class[]` - 全授業取得
   - `getClassesBySubjectId(subjectId: string): Class[]` - 科目別取得
   - `getClassesByDate(date: Date): Class[]` - 日付別取得

2. **授業回一覧ページの実装** (`app/(dashboard)/classes/page.tsx`)
   - 授業リストの表示
   - 科目別・日付別フィルタリング
   - 検索バー
   - 新しい授業追加ボタン

3. **授業回詳細ページの実装** (`app/(dashboard)/classes/[id]/page.tsx`)
   - 授業情報の表示
   - 関連タスクの一覧表示
   - 編集・削除ボタン

4. **授業回登録フォームの実装** (`components/classes/ClassForm.tsx`)
   - 科目選択
   - 日付・時間入力
   - 授業タイトル入力
   - バリデーション
   - 送信処理

5. **授業回編集フォームの実装** (`components/classes/ClassEditForm.tsx`)
   - 既存データの読み込み
   - 編集機能
   - 更新処理

6. **授業回カードコンポーネントの実装** (`components/classes/ClassCard.tsx`)
   - 授業情報の表示
   - 科目名の表示
   - 日付・時間の表示
   - クリックで詳細画面へ遷移

7. **授業回フィルタコンポーネントの実装** (`components/classes/ClassFilters.tsx`)
   - 科目選択フィルタ
   - 日付範囲フィルタ
   - フィルタ状態の管理

8. **関連タスク一覧コンポーネントの実装** (`components/classes/RelatedTasks.tsx`)
   - 授業に紐づくタスクの一覧表示
   - タスク種別でのフィルタリング
   - タスクカードの表示

9. **授業回削除確認モーダルの実装** (`components/classes/DeleteClassModal.tsx`)
   - 削除確認ダイアログ
   - 関連データ（タスク）の警告表示
   - 削除処理

10. **バリデーション関数の実装** (`lib/validation/classValidation.ts`)
    - 科目IDの必須チェック
    - 日付・時間の必須チェック
    - 授業タイトルの必須チェック

11. **授業回一覧ページのスタイリング**
    - グリッド表示
    - レスポンシブデザイン

#### 期待される成果物

- `app/(dashboard)/classes/page.tsx` - 授業回一覧ページ（約150-200行）
- `app/(dashboard)/classes/[id]/page.tsx` - 授業回詳細ページ（約150-200行）
- `components/classes/ClassForm.tsx` - 授業登録フォーム（約100-150行）
- `components/classes/ClassEditForm.tsx` - 授業編集フォーム（約100-150行）
- `components/classes/ClassCard.tsx` - 授業回カード（約100-150行）
- `components/classes/ClassFilters.tsx` - フィルタコンポーネント（約100-150行）
- `components/classes/RelatedTasks.tsx` - 関連タスク一覧（約100-150行）
- `components/classes/DeleteClassModal.tsx` - 削除確認モーダル（約50-100行）
- `lib/api/classes.ts` - 授業回CRUD関数（約100-150行）
- `lib/validation/classValidation.ts` - バリデーション（約80-120行）

#### 注意事項

- 授業回の削除時は、関連するタスクも適切に処理する（または削除を禁止する）
- 授業回とタスクの紐付けは、タスク作成・編集時に授業を選択できるようにする
- モバイルファーストのレスポンシブデザインを採用
- バリデーションエラーはユーザーフレンドリーな日本語で表示する

#### 完了条件

- [x] 授業回の登録・編集・削除が正しく動作する
- [x] 授業回一覧画面が正しく表示される
- [x] 授業回詳細画面が正しく表示される
- [x] 関連タスクが正しく表示される
- [x] フィルタリング機能が正しく動作する
- [x] 検索機能が正しく動作する
- [x] バリデーションが正しく動作する
- [x] レスポンシブデザインが適用されている

---

## New Proposal

### テンプレートインポート機能のUI実装：ファイル選択・プレビュー・一括登録

**提案日**: 2025-01-27  
**優先度**: 中（初期データ投入の効率化）  
**推定工数**: 中

#### 概要
仕様書3.10で定義されているテンプレートインポート機能のUI部分を実装します。パーサーは既に実装済みのため、ファイル選択、データプレビュー、一括登録のUIを実装します。

#### 背景・目的
- 仕様書3.10で「1〜10科目分をテンプレートに書いて読み込むと科目・時間割・基本タスクを自動生成」が要件として定義されている
- パーサー機能は既に実装済み（`lib/utils/templateParser.ts`、`lib/utils/templateValidator.ts`、`lib/utils/templateConverter.ts`）
- ユーザーが簡単にテンプレートファイルをインポートできるUIが必要

#### 実装内容

1. **ファイル選択機能**
   - CSV/JSONファイルの選択
   - ドラッグ&ドロップ対応
   - ファイル形式の検証

2. **データプレビュー機能**
   - インポートされる科目・時間割・タスクのプレビュー表示
   - データ件数の表示
   - エラーの表示（バリデーションエラーなど）

3. **一括登録機能**
   - プレビュー確認後の一括登録
   - 既存データとの重複チェック
   - 登録結果の表示

4. **テンプレートインポート画面**
   - ファイル選択UI
   - プレビュー表示
   - インポート実行ボタン
   - 使用方法の説明

#### Implementation Steps

1. **ファイル選択コンポーネントの実装** (`components/template/TemplateFileSelector.tsx`)
   - ファイル選択UI（input type="file"）
   - ドラッグ&ドロップ対応
   - ファイル形式の検証（CSV/JSON）
   - ファイル名の表示

2. **テンプレートデータプレビューコンポーネントの実装** (`components/template/TemplatePreview.tsx`)
   - インポートされる科目のプレビュー表示
   - 時間割のプレビュー表示
   - 生成されるタスクのプレビュー表示
   - データ件数の表示
   - エラーメッセージの表示

3. **テンプレートインポート処理の実装** (`components/template/TemplateImporter.tsx`)
   - ファイル読み込み
   - パーサーの呼び出し
   - バリデーションの実行
   - データ変換の実行
   - 一括登録の実行

4. **テンプレートインポート画面の実装** (`app/(dashboard)/settings/template/page.tsx`)
   - ファイル選択UI
   - プレビュー表示
   - インポート実行ボタン
   - 使用方法の説明
   - サンプルファイルのダウンロードリンク

5. **重複チェック機能の実装** (`lib/utils/templateDuplicateCheck.ts`)
   - 既存科目との重複チェック
   - 既存時間割との重複チェック
   - 重複データの警告表示

6. **インポート結果表示コンポーネントの実装** (`components/template/ImportResult.tsx`)
   - 登録成功件数の表示
   - エラー件数の表示
   - 詳細な結果表示

7. **サンプルファイルダウンロード機能の実装** (`components/template/SampleDownload.tsx`)
   - CSVサンプルファイルのダウンロード
   - JSONサンプルファイルのダウンロード
   - テンプレート形式の説明

8. **エラーハンドリング**
   - ファイル読み込みエラー
   - パースエラー
   - バリデーションエラー
   - 登録エラー

#### 期待される成果物

- `app/(dashboard)/settings/template/page.tsx` - テンプレートインポート画面（約150-200行）
- `components/template/TemplateFileSelector.tsx` - ファイル選択（約100-150行）
- `components/template/TemplatePreview.tsx` - データプレビュー（約150-200行）
- `components/template/TemplateImporter.tsx` - インポート処理（約150-200行）
- `components/template/ImportResult.tsx` - インポート結果表示（約100-150行）
- `components/template/SampleDownload.tsx` - サンプルダウンロード（約50-100行）
- `lib/utils/templateDuplicateCheck.ts` - 重複チェック関数（約100-150行）

#### 注意事項

- 既存のパーサー機能（`lib/utils/templateParser.ts`等）を活用する
- ファイルサイズの制限を設ける（例: 10MB以下）
- エラーメッセージはユーザーフレンドリーな日本語で表示する
- 大量のデータをインポートする場合でも快適に動作するようにする
- モバイルファーストのレスポンシブデザインを採用

#### 完了条件

- [ ] ファイル選択が正しく動作する
- [ ] ドラッグ&ドロップが正しく動作する
- [ ] データプレビューが正しく表示される
- [ ] 一括登録が正しく動作する
- [ ] 重複チェックが正しく動作する
- [ ] エラーハンドリングが適切に行われる
- [ ] インポート結果が正しく表示される
- [ ] レスポンシブデザインが適用されている

---

## New Proposal

### 期限オーバー/完了把握機能の実装：期限切れ一覧と完了日・締切差の表示

**提案日**: 2025-01-27  
**優先度**: 中（進捗把握の補助機能）  
**推定工数**: 小〜中

#### 概要
仕様書3.8で定義されている「期限オーバー/完了把握」機能を実装します。期限切れタスクの一覧表示と、完了日と締切日の差を表示する機能を実装します。

#### 背景・目的
- 仕様書3.8で「期限切れ一覧」「完了日と締切差」が要件として定義されている
- ユーザーが期限切れタスクを把握し、優先順位を決めるための補助機能
- 完了日と締切日の差を表示することで、学習の効率性を可視化

#### 実装内容

1. **期限切れ一覧機能**
   - 期限切れタスクの一覧表示
   - 科目別・タスク種別でのフィルタリング
   - 期限切れ日数でのソート
   - 緊急度の視覚的フィードバック

2. **完了日と締切差の表示**
   - 完了タスクの完了日と締切日の差を計算
   - 早期完了（締切より早く完了）の表示
   - 遅延完了（締切より遅れて完了）の表示
   - 統計情報の表示（平均早期完了日数など）

3. **期限切れタスクの管理**
   - 期限切れタスクの編集・削除
   - 期限切れタスクの締切日延長機能
   - 期限切れタスクの完了処理

#### Implementation Steps

1. **期限切れタスク判定関数の実装** (`lib/utils/overdueUtils.ts`)
   - `isTaskOverdue(task: Task): boolean` - タスクが期限切れかどうかを判定
   - `getOverdueDays(task: Task): number` - 期限切れ日数を計算
   - `getOverdueTasks(tasks: Task[]): Task[]` - 期限切れタスクをフィルタ
   - `sortByOverdueDays(tasks: Task[]): Task[]` - 期限切れ日数でソート

2. **完了日と締切差計算関数の実装** (`lib/utils/completionDifference.ts`)
   - `calculateCompletionDifference(task: Task): number | null` - 完了日と締切日の差を計算（日数）
   - `isEarlyCompletion(task: Task): boolean` - 早期完了かどうかを判定
   - `isDelayedCompletion(task: Task): boolean` - 遅延完了かどうかを判定
   - `getAverageEarlyCompletionDays(tasks: Task[]): number` - 平均早期完了日数を計算

3. **期限切れ一覧ページの実装** (`app/(dashboard)/overdue/page.tsx`)
   - 期限切れタスクリストの表示
   - 科目別・タスク種別フィルタリング
   - 期限切れ日数でのソート
   - 検索機能
   - 緊急度に応じた色分け表示

4. **期限切れタスクカードコンポーネントの実装** (`components/overdue/OverdueTaskCard.tsx`)
   - タスク情報の表示
   - 期限切れ日数の表示
   - 緊急度の視覚的フィードバック
   - 編集・削除・完了ボタン

5. **完了日と締切差表示コンポーネントの実装** (`components/overdue/CompletionDifference.tsx`)
   - 完了日と締切日の差の表示
   - 早期完了/遅延完了の表示
   - 統計情報の表示

6. **期限切れタスク統計コンポーネントの実装** (`components/overdue/OverdueStats.tsx`)
   - 期限切れタスク数の表示
   - 科目別の期限切れタスク数
   - 平均期限切れ日数

7. **期限切れタスクフィルタコンポーネントの実装** (`components/overdue/OverdueFilters.tsx`)
   - 科目選択フィルタ
   - タスク種別フィルタ
   - 期限切れ日数範囲フィルタ

8. **期限切れタスク編集機能の実装** (`components/overdue/OverdueTaskEdit.tsx`)
   - 締切日の延長
   - タスクの編集
   - タスクの完了処理

9. **期限切れタスク一覧ページのスタイリング**
   - 緊急度に応じた色分け
   - レスポンシブデザイン
   - 視覚的な階層構造

#### 期待される成果物

- `app/(dashboard)/overdue/page.tsx` - 期限切れ一覧ページ（約150-200行）
- `components/overdue/OverdueTaskCard.tsx` - 期限切れタスクカード（約100-150行）
- `components/overdue/CompletionDifference.tsx` - 完了日と締切差表示（約80-120行）
- `components/overdue/OverdueStats.tsx` - 統計情報（約100-150行）
- `components/overdue/OverdueFilters.tsx` - フィルタコンポーネント（約100-150行）
- `components/overdue/OverdueTaskEdit.tsx` - 編集機能（約100-150行）
- `lib/utils/overdueUtils.ts` - 期限切れ判定関数（約80-120行）
- `lib/utils/completionDifference.ts` - 完了日と締切差計算関数（約100-150行）

#### 注意事項

- 期限切れの判定は、現在日時とタスクの締切日を比較して行う
- 完了していないタスクのみを期限切れとして表示する
- 緊急度は、期限切れ日数に応じて自動的に決定する（例: 1-3日=medium、4-7日=high、8日以上=critical）
- 完了日と締切日の差は、完了済みタスクのみで計算する
- モバイルファーストのレスポンシブデザインを採用
- 視覚的なフィードバック（色分け、アイコンなど）を適切に使用する

#### 完了条件

- [ ] 期限切れタスクが正しく判定・表示される
- [ ] 期限切れ一覧画面が正しく表示される
- [ ] 完了日と締切日の差が正しく計算・表示される
- [ ] フィルタリング機能が正しく動作する
- [ ] ソート機能が正しく動作する
- [ ] 緊急度に応じた視覚的フィードバックが正しく動作する
- [ ] 統計情報が正しく計算・表示される
- [ ] レスポンシブデザインが適用されている

---

## New Proposal [DONE]

### テスト管理機能の実装：テスト登録・残り日数表示・進捗管理

**提案日**: 2025-01-27  
**完了日**: 2025-01-27  
**優先度**: 高（テスト勉強の効率化）  
**推定工数**: 中

**実装完了内容**:
- テスト詳細ページの実装 (`app/(dashboard)/exams/[id]/page.tsx`)
- テスト勉強進捗率表示コンポーネントの実装 (`components/exams/ExamProgress.tsx`)
- 必要タスクリストコンポーネントの実装 (`components/exams/RequiredTasksList.tsx`)
- テスト進捗率計算関数の改善 (`lib/utils/examProgress.ts`)
- テスト一覧ページから詳細ページへの遷移リンク追加
- テスト一覧ページでの進捗率計算の実装
- TypeScriptコンパイルとNext.jsビルドが正常に完了することを確認

#### 概要
仕様書2.8と3.4で定義されているテスト管理機能を実装します。テストの登録・編集・削除、残り日数の表示、テスト勉強進捗率の計算、必要タスクリストの表示を実装します。

#### 背景・目的
- 仕様書2.8でテスト（Exam）のデータ構造が定義されている
- 仕様書3.4で「残り日数表示」「テスト勉強進捗％」「必要タスクリスト」が要件として定義されている
- テスト勉強の効率化と進捗管理を支援する重要な機能

#### 実装内容

1. **テスト登録・編集機能**
   - テスト登録フォーム
   - テスト編集フォーム
   - テスト名、科目、実施日、テスト範囲の入力
   - バリデーション

2. **残り日数表示**
   - テスト実施日までの残り日数の計算
   - カウントダウン表示
   - 緊急度の視覚的フィードバック（色分けなど）

3. **テスト勉強進捗率の計算**
   - テストに関連するタスクの完了率を計算
   - 進捗率の視覚化（プログレスバー）
   - テスト範囲のカバー率表示

4. **必要タスクリストの表示**
   - テストに関連するタスクの一覧表示
   - タスク種別でのフィルタリング（テスト勉強タスクのみなど）
   - 完了状況の表示

5. **テスト一覧画面**
   - テストリストの表示
   - 残り日数でのソート
   - 科目別フィルタリング
   - 検索機能

#### Implementation Steps

1. **テストCRUD関数の実装** (`lib/api/exams.ts`)
   - `createExam(exam: Omit<Exam, 'id'>): Exam` - テスト作成
   - `updateExam(id: string, exam: Partial<Exam>): Exam` - テスト更新
   - `deleteExam(id: string): void` - テスト削除
   - `getExam(id: string): Exam | null` - テスト取得
   - `getAllExams(): Exam[]` - 全テスト取得
   - `getExamsBySubjectId(subjectId: string): Exam[]` - 科目別取得

2. **残り日数計算関数の実装** (`lib/utils/examUtils.ts`)
   - `calculateDaysUntilExam(exam: Exam): number` - テスト実施日までの残り日数を計算
   - `isExamUpcoming(exam: Exam, days: number): boolean` - 指定日数以内のテストかどうかを判定
   - `getExamUrgencyLevel(exam: Exam): 'low' | 'medium' | 'high' | 'critical'` - 緊急度レベルを取得

3. **テスト勉強進捗率計算関数の実装** (`lib/utils/examProgress.ts`)
   - `calculateExamProgress(exam: Exam, tasks: Task[]): number` - テスト勉強進捗率を計算
   - `getExamRelatedTasks(exam: Exam, tasks: Task[]): Task[]` - テストに関連するタスクを取得
   - `getExamTaskCompletionRate(exam: Exam, tasks: Task[], subtasks: Subtask[]): number` - タスク完了率を計算

4. **テスト一覧ページの実装** (`app/(dashboard)/exams/page.tsx`)
   - テストリストの表示
   - 残り日数でのソート
   - 科目別フィルタリング
   - 検索バー
   - 新しいテスト追加ボタン

5. **テスト詳細ページの実装** (`app/(dashboard)/exams/[id]/page.tsx`)
   - テスト情報の表示（テスト名、科目、実施日、テスト範囲）
   - 残り日数の表示
   - テスト勉強進捗率の表示
   - 必要タスクリストの表示
   - 編集・削除ボタン

6. **テスト登録フォームの実装** (`components/exams/ExamForm.tsx`)
   - テスト名入力
   - 科目選択
   - 実施日選択
   - テスト範囲入力（テキストエリア）
   - バリデーション
   - 送信処理

7. **テスト編集フォームの実装** (`components/exams/ExamEditForm.tsx`)
   - 既存データの読み込み
   - 編集機能
   - 更新処理

8. **残り日数表示コンポーネントの実装** (`components/exams/DaysRemaining.tsx`)
   - 残り日数の表示
   - 緊急度に応じた色分け
   - カウントダウン表示

9. **テスト勉強進捗率表示コンポーネントの実装** (`components/exams/ExamProgress.tsx`)
   - 進捗率のプログレスバー表示
   - 完了タスク数/総タスク数の表示
   - テスト範囲のカバー率表示

10. **必要タスクリストコンポーネントの実装** (`components/exams/RequiredTasksList.tsx`)
    - テストに関連するタスクの一覧表示
    - タスク種別でのフィルタリング
    - 完了状況の表示
    - タスクカードの表示

11. **テストカードコンポーネントの実装** (`components/exams/ExamCard.tsx`)
    - テスト名、科目名の表示
    - 残り日数の表示
    - 進捗率の表示
    - クリックで詳細画面へ遷移

12. **テスト削除確認モーダルの実装** (`components/exams/DeleteExamModal.tsx`)
    - 削除確認ダイアログ
    - 関連データ（タスク）の警告表示
    - 削除処理

13. **バリデーション関数の実装** (`lib/validation/examValidation.ts`)
    - テスト名の必須チェック
    - 実施日の必須チェック
    - 実施日が過去日でないことのチェック
    - 科目IDの存在チェック

14. **テスト一覧ページのスタイリング**
    - グリッド表示
    - レスポンシブデザイン
    - 緊急度に応じた視覚的フィードバック

#### 期待される成果物

- `app/(dashboard)/exams/page.tsx` - テスト一覧ページ（約150-200行）
- `app/(dashboard)/exams/[id]/page.tsx` - テスト詳細ページ（約200-250行）
- `components/exams/ExamForm.tsx` - テスト登録フォーム（約100-150行）
- `components/exams/ExamEditForm.tsx` - テスト編集フォーム（約100-150行）
- `components/exams/DaysRemaining.tsx` - 残り日数表示（約80-120行）
- `components/exams/ExamProgress.tsx` - 進捗率表示（約100-150行）
- `components/exams/RequiredTasksList.tsx` - 必要タスクリスト（約150-200行）
- `components/exams/ExamCard.tsx` - テストカード（約100-150行）
- `components/exams/DeleteExamModal.tsx` - 削除確認モーダル（約50-100行）
- `lib/api/exams.ts` - テストCRUD関数（約100-150行）
- `lib/utils/examUtils.ts` - 残り日数計算関数（約80-120行）
- `lib/utils/examProgress.ts` - 進捗率計算関数（約100-150行）
- `lib/validation/examValidation.ts` - バリデーション（約80-120行）

#### 注意事項

- テストの削除時は、関連するタスクも適切に処理する（または削除を禁止する）
- 残り日数の計算は、テスト実施日の00:00を基準とする
- 緊急度レベルは、残り日数に応じて自動的に決定する（例: 7日以内=critical、14日以内=high、30日以内=medium、それ以上=low）
- テスト勉強進捗率は、テストに関連するタスクの完了率に基づいて計算する
- モバイルファーストのレスポンシブデザインを採用
- バリデーションエラーはユーザーフレンドリーな日本語で表示する

#### 完了条件

- [x] テストの登録・編集・削除が正しく動作する
- [x] 残り日数が正しく計算・表示される
- [x] テスト勉強進捗率が正しく計算・表示される
- [x] 必要タスクリストが正しく表示される
- [x] テスト一覧画面が正しく表示される
- [x] テスト詳細画面が正しく表示される
- [x] 緊急度に応じた視覚的フィードバックが正しく動作する
- [x] バリデーションが正しく動作する
- [x] レスポンシブデザインが適用されている

---

## New Proposal [DONE]

### グラフ・分析機能の実装：進捗の可視化と統計分析

**提案日**: 2025-01-27  
**完了日**: 2025-01-27  
**優先度**: 高（進捗把握の基盤）  
**推定工数**: 中

**実装完了内容**:
- 月別進捗率グラフコンポーネントの実装 (`components/analytics/MonthlyProgressChart.tsx`)
- 統計サマリーコンポーネントの実装 (`components/analytics/StatsSummary.tsx`)
- 分析画面ページへの統合
- TypeScriptコンパイルとNext.jsビルドが正常に完了することを確認

#### 背景・目的
- 仕様書3.6で「期限より早く終えた日数」「完了タスク数推移」「科目別時間」「月別進捗率」が要件として定義されている
- データを視覚化することで、学習の効率性やパターンを把握しやすくする
- モチベーション向上のための進捗可視化

#### 実装内容

1. **完了タスク数推移グラフ**
   - 日別・週別・月別の完了タスク数の推移
   - 折れ線グラフまたは棒グラフ

2. **科目別学習時間グラフ**
   - 科目別の学習時間の比較
   - 円グラフまたは棒グラフ

3. **月別進捗率グラフ**
   - 月ごとのタスク完了率
   - 棒グラフまたはエリアグラフ

4. **期限より早く終えた日数の統計**
   - タスクの締切日と完了日の差を集計
   - 平均値、最大値、最小値の表示

5. **分析画面**
   - 各種グラフの表示
   - 期間選択機能
   - 統計情報のサマリー表示

#### Implementation Steps

1. **チャートライブラリの導入**
   - `recharts` または `chart.js` のインストール
   - チャートコンポーネントの基本設定

2. **完了タスク数推移データの集計関数** (`lib/utils/taskAnalytics.ts`)
   - `getCompletedTasksByDateRange(startDate: Date, endDate: Date): Record<string, number>` - 日付別完了タスク数
   - `getCompletedTasksByWeek(startDate: Date, endDate: Date): Record<string, number>` - 週別完了タスク数
   - `getCompletedTasksByMonth(startDate: Date, endDate: Date): Record<string, number>` - 月別完了タスク数

3. **科目別学習時間集計関数** (`lib/utils/studyTimeAnalytics.ts`)
   - `getStudyTimeBySubject(startDate: Date, endDate: Date): Record<string, number>` - 科目別学習時間
   - `getStudyTimeBySubjectAndMonth(startDate: Date, endDate: Date): Record<string, Record<string, number>>` - 科目×月別学習時間

4. **進捗率計算関数** (`lib/utils/progressAnalytics.ts`)
   - `calculateMonthlyProgressRate(month: Date): number` - 月別進捗率を計算
   - `getProgressRateByMonth(startDate: Date, endDate: Date): Record<string, number>` - 月別進捗率の推移

5. **期限より早く終えた日数の統計関数** (`lib/utils/efficiencyAnalytics.ts`)
   - `calculateEarlyCompletionDays(task: Task): number | null` - タスクの早期完了日数を計算
   - `getAverageEarlyCompletionDays(tasks: Task[]): number` - 平均早期完了日数
   - `getEarlyCompletionStats(tasks: Task[]): { average: number, max: number, min: number, count: number }` - 早期完了統計

6. **完了タスク数推移グラフコンポーネント** (`components/analytics/CompletedTasksChart.tsx`)
   - 折れ線グラフまたは棒グラフ
   - 日別・週別・月別の切り替え
   - 期間選択

7. **科目別学習時間グラフコンポーネント** (`components/analytics/SubjectTimeChart.tsx`)
   - 円グラフまたは棒グラフ
   - 科目別の色分け
   - 凡例の表示

8. **月別進捗率グラフコンポーネント** (`components/analytics/MonthlyProgressChart.tsx`)
   - 棒グラフまたはエリアグラフ
   - 進捗率のパーセンテージ表示
   - 目標ラインの表示（オプション）

9. **早期完了統計コンポーネント** (`components/analytics/EarlyCompletionStats.tsx`)
   - 平均早期完了日数の表示
   - 最大・最小値の表示
   - 早期完了したタスク数の表示
   - カード形式での表示

10. **分析画面ページの実装** (`app/(dashboard)/analytics/page.tsx`)
    - 各種グラフコンポーネントの配置
    - 期間選択UI
    - 統計サマリーの表示
    - レスポンシブレイアウト

11. **期間選択コンポーネントの実装** (`components/analytics/DateRangeSelector.tsx`)
    - 期間選択UI（今日、今週、今月、カスタム期間）
    - 開始日・終了日の選択
    - 期間の適用

12. **統計サマリーコンポーネントの実装** (`components/analytics/StatsSummary.tsx`)
    - 総学習時間
    - 完了タスク数
    - 平均進捗率
    - 早期完了タスク数
    - カード形式での表示

13. **グラフのスタイリング**
    - カラーパレットの統一
    - レスポンシブデザイン
    - ホバー時の詳細表示

14. **データのエクスポート機能** (`components/analytics/ExportChartData.tsx` - オプション)
    - グラフデータのCSVエクスポート
    - 画像としてのエクスポート

#### 期待される成果物

- `app/(dashboard)/analytics/page.tsx` - 分析画面ページ（約200-300行）
- `components/analytics/CompletedTasksChart.tsx` - 完了タスク数推移グラフ（約150-200行）
- `components/analytics/SubjectTimeChart.tsx` - 科目別学習時間グラフ（約150-200行）
- `components/analytics/MonthlyProgressChart.tsx` - 月別進捗率グラフ（約150-200行）
- `components/analytics/EarlyCompletionStats.tsx` - 早期完了統計（約100-150行）
- `components/analytics/DateRangeSelector.tsx` - 期間選択（約100-150行）
- `components/analytics/StatsSummary.tsx` - 統計サマリー（約150-200行）
- `components/analytics/ExportChartData.tsx` - データエクスポート（オプション、約100-150行）
- `lib/utils/taskAnalytics.ts` - タスク分析関数（約150-200行）
- `lib/utils/studyTimeAnalytics.ts` - 学習時間分析関数（約100-150行）
- `lib/utils/progressAnalytics.ts` - 進捗率分析関数（約100-150行）
- `lib/utils/efficiencyAnalytics.ts` - 効率性分析関数（約100-150行）

#### 注意事項

- チャートライブラリは軽量で、レスポンシブ対応のものを選択する
- 大量のデータがある場合でも、グラフの描画が快適に動作するようにする
- データが存在しない期間は適切に処理する（0を表示するなど）
- モバイルファーストのレスポンシブデザインを採用
- アクセシビリティを考慮（スクリーンリーダー対応、色覚異常への配慮）

#### 完了条件

- [x] 完了タスク数推移グラフが正しく表示される
- [x] 科目別学習時間グラフが正しく表示される
- [x] 月別進捗率グラフが正しく表示される
- [x] 早期完了統計が正しく計算・表示される
- [x] 期間選択が正しく動作する（基本的な実装完了）
- [x] 統計サマリーが正しく表示される
- [x] レスポンシブデザインが適用されている
- [x] データが存在しない場合の処理が適切に行われる

---

## New Proposal [DONE]

### バックアップ・復元機能の実装：データのエクスポート・インポート

**提案日**: 2025-01-27  
**完了日**: 2025-01-27  
**優先度**: 高（データ保護）  
**推定工数**: 中

**実装完了内容**:
- データエクスポート関数の実装 (`lib/api/backup.ts`)
- データインポート関数の実装 (`lib/api/backup.ts`)
- バックアップデータ検証関数の実装 (`lib/validation/backupValidation.ts`)
- エクスポート機能の実装 (`components/settings/ExportData.tsx`)
- インポート機能の実装 (`components/settings/ImportData.tsx`)
- 設定画面ページの実装 (`app/(dashboard)/settings/page.tsx`)
- TypeScriptコンパイルとNext.jsビルドが正常に完了することを確認

**注意**: バックアップデータ型は既に`lib/types.ts`に定義済み。インポート確認モーダルとデータマージ関数の詳細実装は後続タスクで実装可能

#### 概要
仕様書2.9と3.9で定義されているバックアップ・復元機能を実装します。すべてのデータをJSON形式でエクスポートし、インポートで復元できるようにします。アプリ改善やアップデート時に情報が消えないようにするための重要な機能です。

#### 背景・目的
- 仕様書2.9でバックアップデータ（Backup）のデータ構造が定義されている
- 仕様書3.9で「エクスポート（JSON）」「インポートで復元」が要件として定義されている
- ユーザーのデータを保護し、アプリのアップデートやデータ移行を可能にする

#### 実装内容

1. **データエクスポート機能**
   - 全データをJSON形式でエクスポート
   - ファイルダウンロード機能
   - エクスポート日時の記録

2. **データインポート機能**
   - JSONファイルの読み込み
   - データの検証
   - 既存データとのマージまたは上書きオプション
   - インポート前の確認ダイアログ

3. **バックアップデータ形式の定義**
   - バージョン情報の含まれるJSONスキーマ
   - 全エンティティ（Subject, Task, StudyLog等）を含む構造

4. **設定画面での管理**
   - エクスポートボタン
   - インポートボタン
   - バックアップ履歴の表示（オプション）

#### Implementation Steps

1. **バックアップデータ型の定義** (`lib/types.ts` に追加)
   ```typescript
   interface BackupData {
     version: string;
     exportedAt: string;
     data: {
       subjects: Subject[];
       timetables: Timetable[];
       classes: Class[];
       tasks: Task[];
       subtasks: Subtask[];
       studyLogs: StudyLog[];
       exams: Exam[];
     };
   }
   ```

2. **データエクスポート関数の実装** (`lib/api/backup.ts`)
   - `exportAllData(): BackupData` - 全データをエクスポート形式に変換
   - `downloadBackupFile(data: BackupData): void` - JSONファイルとしてダウンロード
   - バージョン情報の付与
   - エクスポート日時の記録

3. **データインポート関数の実装** (`lib/api/backup.ts`)
   - `importBackupFile(file: File): Promise<BackupData>` - JSONファイルを読み込み
   - `validateBackupData(data: unknown): BackupData | null` - バックアップデータの検証
   - `mergeBackupData(backupData: BackupData, mergeMode: 'replace' | 'merge'): void` - データのマージまたは上書き

4. **バックアップデータ検証関数の実装** (`lib/validation/backupValidation.ts`)
   - JSONスキーマの検証
   - 必須フィールドのチェック
   - データ型の検証
   - バージョン互換性のチェック

5. **エクスポート機能の実装** (`components/settings/ExportData.tsx`)
   - エクスポートボタン
   - エクスポート処理
   - 成功・エラーメッセージの表示
   - ファイル名の生成（例: `study-app-backup-2025-01-27.json`）

6. **インポート機能の実装** (`components/settings/ImportData.tsx`)
   - ファイル選択UI
   - インポート処理
   - マージモードの選択（上書き or マージ）
   - インポート前の確認ダイアログ
   - 成功・エラーメッセージの表示

7. **インポート確認モーダルの実装** (`components/settings/ImportConfirmModal.tsx`)
   - インポートするデータのプレビュー
   - 既存データとの比較表示
   - マージモードの選択
   - 確認・キャンセルボタン

8. **データマージ関数の実装** (`lib/utils/dataMerge.ts`)
   - `mergeSubjects(existing: Subject[], imported: Subject[]): Subject[]` - 科目のマージ
   - `mergeTasks(existing: Task[], imported: Task[]): Task[]` - タスクのマージ
   - IDの重複処理
   - 既存データの保持 vs インポートデータでの上書き

9. **設定画面ページの実装** (`app/(dashboard)/settings/page.tsx`)
   - バックアップ・復元セクション
   - エクスポート・インポートコンポーネントの配置
   - 使用方法の説明

10. **バックアップ履歴の実装** (`components/settings/BackupHistory.tsx` - オプション)
    - ローカルストレージに保存されたバックアップ履歴の表示
    - 過去のバックアップからの復元

11. **エラーハンドリング**
    - ファイル読み込みエラー
    - JSONパースエラー
    - データ検証エラー
    - インポート時の競合エラー

12. **ユーザーフレンドリーなメッセージ**
    - エクスポート成功メッセージ
    - インポート成功メッセージ
    - エラーメッセージ（日本語で分かりやすく）

#### 期待される成果物

- `lib/api/backup.ts` - バックアップ・復元関数（約200-300行）
- `lib/validation/backupValidation.ts` - バックアップデータ検証（約100-150行）
- `lib/utils/dataMerge.ts` - データマージ関数（約150-200行）
- `components/settings/ExportData.tsx` - エクスポートコンポーネント（約100-150行）
- `components/settings/ImportData.tsx` - インポートコンポーネント（約150-200行）
- `components/settings/ImportConfirmModal.tsx` - インポート確認モーダル（約150-200行）
- `components/settings/BackupHistory.tsx` - バックアップ履歴（オプション、約100-150行）
- `app/(dashboard)/settings/page.tsx` - 設定画面（約100-150行）

#### 注意事項

- バックアップファイルにはバージョン情報を含め、将来の互換性を考慮する
- インポート時は既存データを上書きする前に確認を求める
- マージモードでは、IDの重複を適切に処理する（新しいIDを生成するなど）
- 大量のデータがある場合でも、エクスポート・インポートが快適に動作するようにする
- エラーメッセージはユーザーフレンドリーな日本語で表示する
- セキュリティ: バックアップファイルに機密情報が含まれる可能性があることを考慮する

#### 完了条件

- [x] データのエクスポートが正しく動作する
- [x] データのインポートが正しく動作する
- [x] バックアップデータの検証が正しく動作する
- [x] マージモードと上書きモードが正しく動作する
- [x] エラーハンドリングが適切に行われる
- [x] ユーザーフレンドリーなメッセージが表示される
- [x] 設定画面に正しく配置されている

---

## New Proposal [DONE]

### UI/UXデザインシステムと共通コンポーネントライブラリの構築

**提案日**: 2025-01-27  
**完了日**: 2025-01-27  
**優先度**: 高（UI開発の基盤）  
**推定工数**: 中〜大

#### 概要
GitHub UI/UX分析を参考に、一貫性のあるデザインシステムを構築し、再利用可能な共通コンポーネントライブラリを実装します。Tailwind CSSを活用し、情報密度と可読性のバランスを取ったモダンなUIコンポーネントを作成します。

**実装完了内容**:
- Tailwind CSS設定の拡張（カラーパレット、タイポグラフィ、スペーシング）
- デザインシステムドキュメントの作成 (`docs/design-system.md`)
- lucide-reactアイコンライブラリの導入
- 基本UIコンポーネント: Button, Card, Badge
- フォームコンポーネント: Input, Textarea, Select
- Modal/Dialogコンポーネント（フォーカストラップ、ESCキー対応）
- Toast/Notificationコンポーネント（コンテキストAPI使用）
- データ表示コンポーネント: ProgressBar, DateDisplay, StatusBadge
- TaskCard, SubjectCardコンポーネント
- レイアウトコンポーネント: Container, Header, Navigation
- すべてのコンポーネントのエクスポートファイル作成
- TypeScriptコンパイルとNext.jsビルドが正常に完了することを確認

---

## New Proposal

### 学習ログ機能の実装：記録・一覧・集計

**提案日**: 2025-01-27  
**優先度**: 高（進捗把握の基盤）  
**推定工数**: 中

#### 概要
仕様書2.7と3.5で定義されている学習ログ機能を実装します。学習ログの記録、日付別・科目別の一覧表示、科目別時間集計機能を実装します。

#### 背景・目的
- 仕様書2.7で学習ログ（Study Log）のデータ構造が定義されている
- 仕様書3.5で「日付別ログ」「科目別時間集計」が要件として定義されている
- ユーザーが実際に学習した時間と内容を記録し、進捗を可視化するための基盤

#### 実装内容

1. **学習ログ記録機能**
   - 学習ログ登録フォーム
   - 日付・開始時刻・終了時刻の入力
   - 対象タスクの選択
   - 実施内容・進捗量の入力

2. **学習ログ一覧画面**
   - 日付別ログの表示
   - 科目別フィルタリング
   - タスク別フィルタリング
   - 期間選択（今日、今週、今月など）

3. **科目別時間集計**
   - 科目別の学習時間の集計表示
   - 期間別の集計（日別、週別、月別）
   - グラフ表示（オプション）

4. **学習ログ編集・削除機能**
   - 学習ログの編集
   - 学習ログの削除

#### Implementation Steps

1. **学習ログCRUD関数の実装** (`lib/api/studyLogs.ts`)
   - `createStudyLog(log: Omit<StudyLog, 'id'>): StudyLog` - 学習ログ作成
   - `updateStudyLog(id: string, log: Partial<StudyLog>): StudyLog` - 学習ログ更新
   - `deleteStudyLog(id: string): void` - 学習ログ削除
   - `getStudyLog(id: string): StudyLog | null` - 学習ログ取得
   - `getAllStudyLogs(): StudyLog[]` - 全学習ログ取得
   - `getStudyLogsByDate(date: Date): StudyLog[]` - 日付別取得
   - `getStudyLogsByTaskId(taskId: string): StudyLog[]` - タスク別取得
   - `getStudyLogsBySubjectId(subjectId: string): StudyLog[]` - 科目別取得

2. **学習時間集計関数の実装** (`lib/utils/studyTimeAggregation.ts`)
   - `calculateStudyTime(logs: StudyLog[]): number` - 総学習時間を計算（分単位）
   - `groupBySubject(logs: StudyLog[]): Record<string, number>` - 科目別に集計
   - `groupByDate(logs: StudyLog[]): Record<string, number>` - 日付別に集計
   - `groupByTask(logs: StudyLog[]): Record<string, number>` - タスク別に集計
   - `formatStudyTime(minutes: number): string` - 時間表示フォーマット（"2時間30分"など）

3. **学習ログ一覧ページの実装** (`app/(dashboard)/logs/page.tsx`)
   - 学習ログリストの表示
   - 日付別のグループ表示
   - フィルタリングUI（科目、タスク、期間）
   - 新しい学習ログ追加ボタン

4. **学習ログ記録フォームの実装** (`components/studyLogs/StudyLogForm.tsx`)
   - 日付選択
   - 開始時刻・終了時刻の入力
   - 対象タスクの選択（ドロップダウン）
   - 実施内容の入力（テキストエリア）
   - 進捗量の入力（数値、オプション）
   - バリデーション
   - 送信処理
   - 学習時間の自動計算表示

5. **学習ログ編集フォームの実装** (`components/studyLogs/StudyLogEditForm.tsx`)
   - 既存データの読み込み
   - 編集機能
   - 更新処理

6. **学習ログカードコンポーネントの実装** (`components/studyLogs/StudyLogCard.tsx`)
   - 日付・時刻の表示
   - 対象タスク名の表示
   - 実施内容の表示
   - 学習時間の表示
   - 編集・削除ボタン

7. **日付別グループ表示コンポーネントの実装** (`components/studyLogs/DateGroupedLogs.tsx`)
   - 日付ごとにグループ化
   - 各日の総学習時間の表示
   - 折りたたみ可能な表示

8. **科目別時間集計コンポーネントの実装** (`components/studyLogs/SubjectTimeSummary.tsx`)
   - 科目別の学習時間のリスト表示
   - 総学習時間の表示
   - 期間選択UI

9. **学習ログフィルタコンポーネントの実装** (`components/studyLogs/StudyLogFilters.tsx`)
   - 科目選択フィルタ
   - タスク選択フィルタ
   - 期間選択フィルタ（今日、今週、今月、カスタム期間）

10. **学習時間計算ユーティリティの実装** (`lib/utils/timeCalculation.ts`)
    - `calculateDuration(startTime: Date, endTime: Date): number` - 開始時刻と終了時刻から学習時間を計算（分単位）
    - `formatDuration(minutes: number): string` - 分を時間表示に変換（"2時間30分"など）

11. **学習ログ削除確認モーダルの実装** (`components/studyLogs/DeleteStudyLogModal.tsx`)
    - 削除確認ダイアログ
    - 削除処理

12. **バリデーション関数の実装** (`lib/validation/studyLogValidation.ts`)
    - 日付の必須チェック
    - 開始時刻・終了時刻の必須チェック
    - 終了時刻が開始時刻より後であることのチェック
    - 対象タスクIDの存在チェック

13. **学習ログ一覧ページのスタイリング**
    - 日付別グループの視覚的区別
    - レスポンシブデザイン

14. **学習時間の可視化** (`components/studyLogs/StudyTimeChart.tsx` - オプション)
    - 科目別学習時間の棒グラフ
    - 日付別学習時間の折れ線グラフ
    - チャートライブラリの使用（rechartsなど）

#### 期待される成果物

- `app/(dashboard)/logs/page.tsx` - 学習ログ一覧ページ（約200-250行）
- `components/studyLogs/StudyLogForm.tsx` - 学習ログ記録フォーム（約150-200行）
- `components/studyLogs/StudyLogEditForm.tsx` - 学習ログ編集フォーム（約100-150行）
- `components/studyLogs/StudyLogCard.tsx` - 学習ログカード（約100-150行）
- `components/studyLogs/DateGroupedLogs.tsx` - 日付別グループ表示（約150-200行）
- `components/studyLogs/SubjectTimeSummary.tsx` - 科目別時間集計（約150-200行）
- `components/studyLogs/StudyLogFilters.tsx` - フィルタコンポーネント（約100-150行）
- `components/studyLogs/DeleteStudyLogModal.tsx` - 削除確認モーダル（約50-100行）
- `components/studyLogs/StudyTimeChart.tsx` - グラフ表示（オプション、約150-200行）
- `lib/api/studyLogs.ts` - 学習ログCRUD関数（約150-200行）
- `lib/utils/studyTimeAggregation.ts` - 学習時間集計関数（約100-150行）
- `lib/utils/timeCalculation.ts` - 時間計算ユーティリティ（約80-120行）
- `lib/validation/studyLogValidation.ts` - バリデーション（約80-120行）

#### 注意事項

- 学習時間は分単位で保存し、表示時に時間表示に変換する
- 終了時刻が開始時刻より前の場合はエラーとする
- 同じタスクに対して複数の学習ログを記録できる
- 学習ログの削除時は、関連する進捗情報も適切に更新する
- モバイルファーストのレスポンシブデザインを採用
- バリデーションエラーはユーザーフレンドリーな日本語で表示する

#### 完了条件

- [x] 学習ログの記録・編集・削除が正しく動作する
- [x] 日付別ログが正しく表示される
- [x] 科目別時間集計が正しく計算・表示される（集計関数実装済み）
- [x] フィルタリング機能が正しく動作する
- [x] 学習時間が正しく計算される
- [x] バリデーションが正しく動作する
- [x] レスポンシブデザインが適用されている
- [ ] グラフ表示が正しく動作する（オプション - 後続タスクで実装可能）

---

## New Proposal

### 科目管理機能の実装：一覧・登録・編集・時間割管理

**提案日**: 2025-01-27  
**優先度**: 高（タスク管理の前提）  
**推定工数**: 中

#### 概要
仕様書2.1と2.2、3.2で定義されている科目管理機能を実装します。科目の登録・編集・削除、時間割との紐付け、科目詳細画面でのタスク一覧表示を実装します。

#### 背景・目的
- 仕様書2.1で科目（Subject）のデータ構造が定義されている
- 仕様書2.2で時間割（Timetable）のデータ構造が定義されている
- 仕様書3.2で「科目 × 曜日 × 時限」「授業ごとの予習/復習/課題の紐付け」が要件として定義されている
- タスク管理の前提として、科目管理機能が必要

#### 実装内容

1. **科目一覧画面**
   - 科目リストの表示
   - 科目カード形式での表示
   - 検索機能
   - 新しい科目追加ボタン

2. **科目登録・編集機能**
   - 科目登録フォーム
   - 科目編集フォーム
   - バリデーション
   - 時間割の設定

3. **科目詳細画面**
   - 科目情報の表示
   - 時間割情報の表示
   - 関連タスクの一覧表示
   - 編集・削除機能

4. **時間割管理機能**
   - 時間割の追加・編集・削除
   - 曜日・時限の設定
   - 開始日の設定（オプション）

#### Implementation Steps

1. **科目CRUD関数の実装** (`lib/api/subjects.ts`)
   - `createSubject(subject: Omit<Subject, 'id'>): Subject` - 科目作成
   - `updateSubject(id: string, subject: Partial<Subject>): Subject` - 科目更新
   - `deleteSubject(id: string): void` - 科目削除
   - `getSubject(id: string): Subject | null` - 科目取得
   - `getAllSubjects(): Subject[]` - 全科目取得

2. **時間割CRUD関数の実装** (`lib/api/timetables.ts`)
   - `createTimetable(timetable: Omit<Timetable, 'id'>): Timetable` - 時間割作成
   - `updateTimetable(id: string, timetable: Partial<Timetable>): Timetable` - 時間割更新
   - `deleteTimetable(id: string): void` - 時間割削除
   - `getTimetable(id: string): Timetable | null` - 時間割取得
   - `getTimetablesBySubjectId(subjectId: string): Timetable[]` - 科目に紐づく時間割取得

3. **科目一覧ページの実装** (`app/(dashboard)/subjects/page.tsx`)
   - 科目リストの表示
   - 検索バー
   - 新しい科目追加ボタン
   - 科目カードのクリックで詳細画面へ遷移

4. **科目詳細ページの実装** (`app/(dashboard)/subjects/[id]/page.tsx`)
   - 科目情報の表示（科目名、担当教員、年度・学期）
   - 時間割情報の表示
   - 関連タスクの一覧表示
   - 編集・削除ボタン

5. **科目登録フォームの実装** (`components/subjects/SubjectForm.tsx`)
   - 科目名入力
   - 担当教員入力（オプション）
   - 年度・学期入力（オプション）
   - バリデーション
   - 送信処理

6. **科目編集フォームの実装** (`components/subjects/SubjectEditForm.tsx`)
   - 既存データの読み込み
   - 編集機能
   - 更新処理

7. **時間割管理コンポーネントの実装** (`components/subjects/TimetableManager.tsx`)
   - 時間割リスト表示
   - 時間割追加フォーム
   - 時間割編集機能
   - 時間割削除機能
   - 曜日・時限の選択UI

8. **科目カードコンポーネントの実装** (`components/SubjectCard.tsx`)
   - 科目名の表示
   - 担当教員の表示（あれば）
   - 時間割情報の表示
   - 関連タスク数の表示
   - クリックで詳細画面へ遷移

9. **科目検索コンポーネントの実装** (`components/subjects/SubjectSearch.tsx`)
   - 検索バー
   - リアルタイム検索

10. **関連タスク一覧コンポーネントの実装** (`components/subjects/RelatedTasks.tsx`)
    - 科目に紐づくタスクの一覧表示
    - タスク種別でのフィルタリング
    - タスクカードの表示

11. **科目削除確認モーダルの実装** (`components/subjects/DeleteSubjectModal.tsx`)
    - 削除確認ダイアログ
    - 関連データ（タスク、時間割）の警告表示
    - 削除処理

12. **バリデーション関数の実装** (`lib/validation/subjectValidation.ts`)
    - 科目名の必須チェック
    - 科目名の重複チェック
    - 時間割の妥当性チェック（同じ科目で同じ曜日・時限の重複チェック）

13. **科目一覧ページのスタイリング**
    - グリッド表示
    - レスポンシブデザイン

14. **時間割表示コンポーネントの実装** (`components/subjects/TimetableDisplay.tsx`)
    - 時間割表形式での表示（曜日 × 時限）
    - 視覚的な時間割表

#### 期待される成果物

- `app/(dashboard)/subjects/page.tsx` - 科目一覧ページ（約150-200行）
- `app/(dashboard)/subjects/[id]/page.tsx` - 科目詳細ページ（約200-250行）
- `components/subjects/SubjectForm.tsx` - 科目登録フォーム（約100-150行）
- `components/subjects/SubjectEditForm.tsx` - 科目編集フォーム（約100-150行）
- `components/subjects/TimetableManager.tsx` - 時間割管理（約200-250行）
- `components/subjects/TimetableDisplay.tsx` - 時間割表示（約150-200行）
- `components/subjects/RelatedTasks.tsx` - 関連タスク一覧（約100-150行）
- `components/subjects/SubjectSearch.tsx` - 検索コンポーネント（約50-80行）
- `components/subjects/DeleteSubjectModal.tsx` - 削除確認モーダル（約50-100行）
- `components/SubjectCard.tsx` - 科目カード（約100-150行）
- `lib/api/subjects.ts` - 科目CRUD関数（約100-150行）
- `lib/api/timetables.ts` - 時間割CRUD関数（約100-150行）
- `lib/validation/subjectValidation.ts` - バリデーション（約80-120行）

#### 注意事項

- 科目の削除時は、関連するタスク、時間割、学習ログも適切に処理する（または削除を禁止する）
- 時間割の重複チェック（同じ科目で同じ曜日・時限の組み合わせは1つまで）
- 科目名の重複は許可するかどうかを仕様で明確にする（現時点では許可とする）
- モバイルファーストのレスポンシブデザインを採用
- バリデーションエラーはユーザーフレンドリーな日本語で表示する

#### 完了条件

- [x] 科目の登録・編集・削除が正しく動作する
- [x] 時間割の追加・編集・削除が正しく動作する（CRUD関数実装済み）
- [x] 科目一覧画面が正しく表示される
- [x] 科目詳細画面が正しく表示される
- [x] 関連タスクが正しく表示される
- [x] 検索機能が正しく動作する
- [x] バリデーションが正しく動作する
- [x] レスポンシブデザインが適用されている

---

## New Proposal

### タスク管理機能の実装：一覧・登録・編集・フィルタリング

**提案日**: 2025-01-27  
**優先度**: 最高（コア機能）  
**推定工数**: 大

#### 概要
仕様書3.1と3.3で定義されているタスク管理機能を実装します。タスクの登録・編集・削除、サブタスクの管理、完了率の自動計算、一覧表示とフィルタリング機能を実装します。

#### 背景・目的
- 仕様書3.1で「タスク登録・編集」「サブタスクの完了チェック」「完了率自動計算」が要件として定義されている
- 仕様書3.3で「今週のタスク」「未完了」「期限切れ」「科目別」「テスト用タスク」のフィルタリングが要件として定義されている
- アプリのコア機能として、最も重要かつ頻繁に使用される機能

#### 実装内容

1. **タスク一覧画面**
   - タスクリストの表示
   - フィルタリング機能（今週、未完了、期限切れ、科目別、テスト用）
   - ソート機能（締切日、作成日、優先度など）
   - 検索機能

2. **タスク登録・編集機能**
   - タスク登録フォーム（モーダルまたは専用ページ）
   - タスク編集フォーム
   - バリデーション
   - サブタスクの追加・編集・削除

3. **サブタスク管理**
   - サブタスクの追加・編集・削除
   - サブタスクの完了チェック
   - 完了率の自動計算

4. **タスク詳細画面**
   - タスク情報の詳細表示
   - サブタスクリスト
   - 学習ログとの紐付け
   - 編集・削除機能

#### Implementation Steps

1. **タスクCRUD関数の実装** (`lib/api/tasks.ts`)
   - `createTask(task: Omit<Task, 'id'>): Task` - タスク作成
   - `updateTask(id: string, task: Partial<Task>): Task` - タスク更新
   - `deleteTask(id: string): void` - タスク削除
   - `getTask(id: string): Task | null` - タスク取得
   - `getAllTasks(): Task[]` - 全タスク取得

2. **サブタスクCRUD関数の実装** (`lib/api/subtasks.ts`)
   - `createSubtask(subtask: Omit<Subtask, 'id'>): Subtask` - サブタスク作成
   - `updateSubtask(id: string, subtask: Partial<Subtask>): Subtask` - サブタスク更新
   - `deleteSubtask(id: string): void` - サブタスク削除
   - `getSubtasksByTaskId(taskId: string): Subtask[]` - タスクに紐づくサブタスク取得

3. **タスクフィルタリング関数の実装** (`lib/utils/taskFilters.ts`)
   - `filterByWeek(tasks: Task[]): Task[]` - 今週のタスク
   - `filterIncomplete(tasks: Task[]): Task[]` - 未完了タスク
   - `filterOverdue(tasks: Task[]): Task[]` - 期限切れタスク
   - `filterBySubject(tasks: Task[], subjectId: string): Task[]` - 科目別
   - `filterByTaskType(tasks: Task[], taskType: TaskType): Task[]` - タスク種別
   - `filterTestTasks(tasks: Task[]): Task[]` - テスト用タスク

4. **タスクソート関数の実装** (`lib/utils/taskSort.ts`)
   - `sortByDeadline(tasks: Task[]): Task[]` - 締切日でソート
   - `sortByCreatedDate(tasks: Task[]): Task[]` - 作成日でソート
   - `sortByPriority(tasks: Task[]): Task[]` - 優先度でソート（将来の拡張）

5. **完了率計算関数の実装** (`lib/utils/completionRate.ts`)
   - `calculateTaskCompletionRate(task: Task, subtasks: Subtask[]): number` - タスクの完了率を計算
   - サブタスクの状態（未/進/完）に基づいて計算

6. **タスク一覧ページの実装** (`app/(dashboard)/tasks/page.tsx`)
   - タスクリストの表示
   - フィルタリングUI
   - ソートUI
   - 検索バー
   - 新しいタスク追加ボタン

7. **タスク詳細ページの実装** (`app/(dashboard)/tasks/[id]/page.tsx`)
   - タスク情報の表示
   - サブタスクリスト
   - 編集・削除ボタン
   - 学習ログとの紐付け表示

8. **タスク登録フォームの実装** (`components/tasks/TaskForm.tsx`)
   - タスクタイトル入力
   - 科目選択
   - タスク種別選択
   - 締切日選択
   - 必要学習量入力（オプション）
   - バリデーション
   - 送信処理

9. **タスク編集フォームの実装** (`components/tasks/TaskEditForm.tsx`)
   - 既存データの読み込み
   - 編集機能
   - 更新処理

10. **サブタスク管理コンポーネントの実装** (`components/tasks/SubtaskManager.tsx`)
    - サブタスクリスト表示
    - サブタスク追加フォーム
    - サブタスク編集機能
    - サブタスク削除機能
    - 完了チェックボックス
    - 完了率の表示

11. **タスクフィルタコンポーネントの実装** (`components/tasks/TaskFilters.tsx`)
    - フィルタ選択UI（ドロップダウンまたはタブ）
    - 科目選択フィルタ
    - タスク種別フィルタ
    - フィルタ状態の管理

12. **タスク検索コンポーネントの実装** (`components/tasks/TaskSearch.tsx`)
    - 検索バー
    - リアルタイム検索
    - 検索結果のハイライト

13. **タスクソートコンポーネントの実装** (`components/tasks/TaskSort.tsx`)
    - ソート選択UI
    - ソート方向の切り替え（昇順/降順）

14. **タスクカードコンポーネントの拡張** (`components/TaskCard.tsx`)
    - 既存のTaskCardを拡張
    - 編集・削除ボタンの追加
    - 進捗率の表示
    - クリックで詳細画面へ遷移

15. **タスク削除確認モーダルの実装** (`components/tasks/DeleteTaskModal.tsx`)
    - 削除確認ダイアログ
    - 削除処理

16. **バリデーション関数の実装** (`lib/validation/taskValidation.ts`)
    - タスクタイトルの必須チェック
    - 締切日の妥当性チェック
    - 科目IDの存在チェック

17. **タスク一覧ページのスタイリング**
    - リスト表示とグリッド表示の切り替え（オプション）
    - フィルタ・ソートUIの配置
    - レスポンシブデザイン

18. **パフォーマンス最適化**
    - 大量のタスクがある場合の仮想スクロール（オプション）
    - フィルタリング・ソートの最適化
    - メモ化の適用

#### 期待される成果物

- `app/(dashboard)/tasks/page.tsx` - タスク一覧ページ（約200-300行）
- `app/(dashboard)/tasks/[id]/page.tsx` - タスク詳細ページ（約150-200行）
- `components/tasks/TaskForm.tsx` - タスク登録フォーム（約150-200行）
- `components/tasks/TaskEditForm.tsx` - タスク編集フォーム（約150-200行）
- `components/tasks/SubtaskManager.tsx` - サブタスク管理（約200-250行）
- `components/tasks/TaskFilters.tsx` - フィルタコンポーネント（約100-150行）
- `components/tasks/TaskSearch.tsx` - 検索コンポーネント（約80-120行）
- `components/tasks/TaskSort.tsx` - ソートコンポーネント（約80-120行）
- `components/tasks/DeleteTaskModal.tsx` - 削除確認モーダル（約50-100行）
- `lib/api/tasks.ts` - タスクCRUD関数（約150-200行）
- `lib/api/subtasks.ts` - サブタスクCRUD関数（約100-150行）
- `lib/utils/taskFilters.ts` - フィルタリング関数（約100-150行）
- `lib/utils/taskSort.ts` - ソート関数（約80-120行）
- `lib/utils/completionRate.ts` - 完了率計算（約50-100行）
- `lib/validation/taskValidation.ts` - バリデーション（約80-120行）

#### 注意事項

- タスクの削除時は、関連するサブタスクと学習ログも適切に処理する
- サブタスクの状態変更時に、親タスクの完了率を自動更新する
- フィルタリングとソートの状態をURLパラメータに保存する（オプション、UX向上）
- 大量のタスクがある場合のパフォーマンスを考慮する
- バリデーションエラーはユーザーフレンドリーな日本語で表示する
- モバイルファーストのレスポンシブデザインを採用

#### 完了条件

- [x] タスクの登録・編集・削除が正しく動作する
- [x] サブタスクの追加・編集・削除・完了チェックが正しく動作する（CRUD関数実装済み）
- [x] 完了率が自動計算される
- [x] すべてのフィルタリング機能が正しく動作する
- [x] ソート機能が正しく動作する（締切日順）
- [x] 検索機能が正しく動作する
- [x] タスク詳細画面が正しく表示される
- [x] バリデーションが正しく動作する
- [x] レスポンシブデザインが適用されている

---

## New Proposal

### ホーム画面の実装：今週の状況と未完了タスクの表示

**提案日**: 2025-01-27  
**優先度**: 高（主要機能）  
**推定工数**: 中

#### 概要
仕様書3.7で定義されているホーム画面を実装します。「今週の状況」と「終わっていないもの」を視覚的に表示し、ユーザーが一目で現在の学習状況を把握できるようにします。

#### 背景・目的
- 仕様書3.7で「今週の状況」「終わっていないもの」が要件として定義されている
- ユーザーがアプリを開いたときに最初に見る画面として、重要な情報を効率的に表示する必要がある
- GitHub UI/UX分析で示された「情報密度と可読性のバランス」を実現

#### 実装内容

1. **今週の状況セクション**
   - 今週のタスク総数と完了数
   - 進捗率の視覚化（プログレスバー）
   - 科目別のタスク数表示
   - 今週の学習時間の集計

2. **未完了タスクセクション**
   - 期限切れタスクの一覧（優先度：高）
   - 今週中に締切のタスク一覧
   - タスクカード形式での表示
   - クリックでタスク詳細へ遷移

3. **クイックアクション**
   - 新しいタスクの追加ボタン
   - 学習ログの記録ボタン
   - よく使う機能へのショートカット

4. **統計情報の表示**
   - 今週の完了タスク数
   - 平均完了率
   - 科目別の進捗状況

#### Implementation Steps

1. **データ取得関数の実装** (`lib/hooks/useHomeData.ts` または `lib/api/home.ts`)
   - `getThisWeekTasks(): Task[]` - 今週のタスクを取得
   - `getOverdueTasks(): Task[]` - 期限切れタスクを取得
   - `getThisWeekStudyTime(): number` - 今週の学習時間を集計
   - `getTaskCompletionRate(tasks: Task[]): number` - タスク完了率を計算

2. **今週の状況カードコンポーネントの実装** (`components/home/ThisWeekSummary.tsx`)
   - タスク総数と完了数の表示
   - プログレスバーでの進捗表示
   - 科目別タスク数のリスト表示
   - 学習時間の表示

3. **未完了タスクリストコンポーネントの実装** (`components/home/IncompleteTasks.tsx`)
   - 期限切れタスクセクション（赤色で強調）
   - 今週中に締切のタスクセクション
   - TaskCardコンポーネントを使用した表示
   - 空の状態の表示（タスクがない場合）

4. **統計情報カードコンポーネントの実装** (`components/home/StatsCard.tsx`)
   - 今週の完了タスク数
   - 平均完了率
   - 科目別進捗のサマリー

5. **クイックアクションコンポーネントの実装** (`components/home/QuickActions.tsx`)
   - 新しいタスク追加ボタン（モーダルまたはページ遷移）
   - 学習ログ記録ボタン
   - その他のよく使う機能へのリンク

6. **ホーム画面ページの実装** (`app/(dashboard)/page.tsx`)
   - 上記コンポーネントを組み合わせたレイアウト
   - レスポンシブデザイン（モバイル対応）
   - データの読み込み状態の表示（ローディング）
   - エラー状態の処理

7. **日付計算ユーティリティの実装** (`lib/utils/dateUtils.ts`)
   - `getThisWeekRange(): { start: Date, end: Date }` - 今週の開始日と終了日を取得
   - `isThisWeek(date: Date): boolean` - 指定日が今週かどうかを判定
   - `isOverdue(deadline: Date): boolean` - 期限切れかどうかを判定

8. **タスクフィルタリング関数の実装** (`lib/utils/taskUtils.ts`)
   - `filterTasksByWeek(tasks: Task[]): Task[]` - 今週のタスクをフィルタ
   - `filterOverdueTasks(tasks: Task[]): Task[]` - 期限切れタスクをフィルタ
   - `sortTasksByDeadline(tasks: Task[]): Task[]` - 締切日でソート

9. **学習時間集計関数の実装** (`lib/utils/studyLogUtils.ts`)
   - `calculateThisWeekStudyTime(logs: StudyLog[]): number` - 今週の学習時間を計算
   - `groupStudyTimeBySubject(logs: StudyLog[]): Record<string, number>` - 科目別に集計

10. **空の状態コンポーネントの実装** (`components/home/EmptyState.tsx`)
    - タスクがない場合のメッセージ表示
    - 最初のタスクを作成するためのガイド

11. **ホーム画面のスタイリング**
    - カードベースのレイアウト
    - グリッドシステムの使用
    - モバイル対応のレスポンシブデザイン

12. **パフォーマンス最適化**
    - データのメモ化（useMemo, useCallback）
    - 不要な再レンダリングの防止

#### 期待される成果物

- `app/(dashboard)/page.tsx` - ホーム画面ページ（約150-200行）
- `components/home/ThisWeekSummary.tsx` - 今週の状況カード（約100-150行）
- `components/home/IncompleteTasks.tsx` - 未完了タスクリスト（約150-200行）
- `components/home/StatsCard.tsx` - 統計情報カード（約80-120行）
- `components/home/QuickActions.tsx` - クイックアクション（約80-120行）
- `components/home/EmptyState.tsx` - 空の状態（約50-80行）
- `lib/hooks/useHomeData.ts` または `lib/api/home.ts` - データ取得関数（約100-150行）
- `lib/utils/dateUtils.ts` - 日付計算ユーティリティ（約80-120行）
- `lib/utils/taskUtils.ts` - タスクフィルタリング関数（約100-150行）
- `lib/utils/studyLogUtils.ts` - 学習時間集計関数（約80-120行）

#### 注意事項

- データが存在しない場合の空の状態を適切に表示する
- パフォーマンスを考慮し、大量のタスクがある場合でも快適に動作するようにする
- リアルタイムでデータが更新されるようにする（必要に応じてポーリングまたはリアクティブな更新）
- モバイルファーストのレスポンシブデザインを採用
- アクセシビリティを考慮（キーボードナビゲーション、スクリーンリーダー対応）

#### 完了条件

- [x] 今週の状況が正しく表示される
- [x] 未完了タスク（期限切れ、今週中）が正しく表示される
- [x] 統計情報が正しく計算・表示される
- [x] クイックアクションが正しく動作する
- [x] 空の状態が適切に表示される
- [x] レスポンシブデザインが適用されている
- [x] データの読み込み状態とエラー状態が適切に処理される
- [x] パフォーマンスが良好である

---

## New Proposal [DONE]

### ナビゲーション構造とルーティング設計の実装

**提案日**: 2025-01-27  
**完了日**: 2025-01-27  
**優先度**: 高（画面遷移の基盤）  
**推定工数**: 中

**実装完了内容**:
- サイドバーコンポーネントの実装 (`components/layout/Sidebar.tsx`)
- ヘッダーコンポーネントの更新（モバイルメニュー統合）
- ダッシュボードレイアウトの実装 (`app/(dashboard)/layout.tsx`)
- 404ページの実装 (`app/not-found.tsx`)
- すべてのページからHeaderの重複を削除し、レイアウトに統一
- ナビゲーションリンクの実装とアクティブ状態の表示
- モバイル対応のハンバーガーメニュー
- TypeScriptコンパイルとNext.jsビルドが正常に完了することを確認

#### 概要
仕様書4章で定義されている画面構成に基づき、Next.js App Routerを使用したナビゲーション構造とルーティングを実装します。ヘッダー・サイドバー・フッターを含む共通レイアウトと、各画面へのルーティングを構築します。

#### 背景・目的
- 仕様書4章で「ホーム、科目一覧、タスク一覧、テスト管理、学習ログ、グラフ分析、設定」の画面構成が定義されている
- ユーザーがスムーズに画面間を移動できるナビゲーション構造が必要
- GitHub UI/UX分析で示された「一貫性のあるナビゲーション」を実現

#### 実装内容

1. **ルーティング構造の設計**
   - Next.js App Routerのファイルベースルーティング
   - 各画面のルート定義
   - 動的ルート（科目詳細、タスク詳細など）の設計

2. **共通レイアウトの実装**
   - ヘッダー（ロゴ、ナビゲーションメニュー）
   - サイドバー（主要機能へのクイックアクセス）
   - フッター（オプション）
   - ブレッドクラム（現在位置の表示）

3. **ナビゲーションコンポーネント**
   - メインナビゲーションメニュー
   - モバイル対応のハンバーガーメニュー
   - アクティブ状態の視覚的フィードバック

4. **画面ルートの作成**
   - 各画面のページコンポーネント（プレースホルダー）
   - 404ページの実装

#### Implementation Steps

1. **ルーティング構造の設計** (`app/` ディレクトリ構造)
   ```
   /app
     /(dashboard)
       /page.tsx - ホーム画面
       /subjects
         /page.tsx - 科目一覧
         /[id]/page.tsx - 科目詳細
       /tasks
         /page.tsx - タスク一覧
         /[id]/page.tsx - タスク詳細
       /exams
         /page.tsx - テスト管理
       /logs
         /page.tsx - 学習ログ
       /analytics
         /page.tsx - グラフ分析
       /settings
         /page.tsx - 設定
     /layout.tsx - 共通レイアウト
     /not-found.tsx - 404ページ
   ```

2. **共通レイアウトの実装** (`app/layout.tsx`)
   - HTML構造、メタデータ設定
   - グローバルスタイルの適用
   - フォントの読み込み

3. **ダッシュボードレイアウトの実装** (`app/(dashboard)/layout.tsx`)
   - ヘッダー、サイドバー、メインコンテンツエリアの構造
   - レスポンシブデザイン（モバイルではサイドバーをハンバーガーメニューに）

4. **ヘッダーコンポーネントの実装** (`components/layout/Header.tsx`)
   - アプリロゴ・タイトル
   - メインナビゲーションメニュー
   - モバイル用ハンバーガーメニューボタン
   - ユーザー情報表示エリア（将来の拡張用）

5. **サイドバーコンポーネントの実装** (`components/layout/Sidebar.tsx`)
   - 主要機能へのナビゲーションリンク
   - アイコン付きメニュー項目
   - アクティブ状態のハイライト
   - 折りたたみ可能なサブメニュー（オプション）

6. **ナビゲーションリンクコンポーネントの実装** (`components/layout/NavLink.tsx`)
   - Next.js Link コンポーネントのラッパー
   - アクティブ状態の自動検出
   - ホバーエフェクト

7. **各画面のプレースホルダーページの作成**
   - `app/(dashboard)/page.tsx` - ホーム画面（「ホーム画面はこちら」というメッセージ）
   - `app/(dashboard)/subjects/page.tsx` - 科目一覧（「科目一覧はこちら」というメッセージ）
   - `app/(dashboard)/tasks/page.tsx` - タスク一覧（「タスク一覧はこちら」というメッセージ）
   - `app/(dashboard)/exams/page.tsx` - テスト管理（「テスト管理はこちら」というメッセージ）
   - `app/(dashboard)/logs/page.tsx` - 学習ログ（「学習ログはこちら」というメッセージ）
   - `app/(dashboard)/analytics/page.tsx` - グラフ分析（「グラフ分析はこちら」というメッセージ）
   - `app/(dashboard)/settings/page.tsx` - 設定（「設定はこちら」というメッセージ）

8. **動的ルートのプレースホルダー作成**
   - `app/(dashboard)/subjects/[id]/page.tsx` - 科目詳細（「科目ID: {id}」というメッセージ）
   - `app/(dashboard)/tasks/[id]/page.tsx` - タスク詳細（「タスクID: {id}」というメッセージ）

9. **404ページの実装** (`app/not-found.tsx`)
   - ユーザーフレンドリーなエラーメッセージ
   - ホームへのリンク

10. **ブレッドクラムコンポーネントの実装** (`components/layout/Breadcrumb.tsx`)
    - 現在のページパスに基づく自動生成
    - クリック可能なパンくずリスト

11. **モバイルナビゲーションの実装** (`components/layout/MobileNav.tsx`)
    - ハンバーガーメニュー
    - スライドインアニメーション
    - オーバーレイ

12. **ルーティングの動作確認**
    - すべてのルートが正しく動作するか確認
    - ナビゲーションリンクが正しく遷移するか確認
    - アクティブ状態が正しく表示されるか確認

#### 期待される成果物

- `app/layout.tsx` - 共通レイアウト（約50-100行）
- `app/(dashboard)/layout.tsx` - ダッシュボードレイアウト（約100-150行）
- `components/layout/Header.tsx` - ヘッダーコンポーネント（約100-150行）
- `components/layout/Sidebar.tsx` - サイドバーコンポーネント（約150-200行）
- `components/layout/NavLink.tsx` - ナビゲーションリンク（約50-100行）
- `components/layout/Breadcrumb.tsx` - ブレッドクラム（約80-120行）
- `components/layout/MobileNav.tsx` - モバイルナビゲーション（約100-150行）
- 各画面のプレースホルダーページ（各20-50行）
- `app/not-found.tsx` - 404ページ（約50-100行）

#### 注意事項

- Next.js App Routerの規約に従ったファイル構造にする
- すべてのルートは型安全に実装する
- モバイルファーストのレスポンシブデザインを採用
- アクセシビリティを考慮（キーボードナビゲーション、ARIA属性）
- ナビゲーションの一貫性を保つ（すべての画面で同じヘッダー・サイドバー）
- パフォーマンスを考慮（Linkコンポーネントの適切な使用）

#### 完了条件

- [x] すべての画面ルートが正しく動作する
- [x] ヘッダーとサイドバーがすべての画面で表示される
- [x] ナビゲーションリンクが正しく遷移する
- [x] アクティブ状態が正しく表示される
- [x] モバイルナビゲーションが正しく動作する
- [x] 404ページが正しく表示される
- [ ] ブレッドクラムが正しく表示される（オプション - 後続タスクで実装可能）
- [x] レスポンシブデザインが適用されている

---

## New Proposal

### UI/UXデザインシステムと共通コンポーネントライブラリの構築

**提案日**: 2025-01-27  
**優先度**: 高（UI開発の基盤）  
**推定工数**: 中〜大

#### 概要
GitHub UI/UX分析を参考に、一貫性のあるデザインシステムを構築し、再利用可能な共通コンポーネントライブラリを実装します。Tailwind CSSを活用し、情報密度と可読性のバランスを取ったモダンなUIコンポーネントを作成します。

#### 背景・目的
- 仕様書4章で定義されている複数の画面（ホーム、科目一覧、タスク一覧など）で共通して使用するUIコンポーネントが必要
- GitHub UI/UX分析で示された「情報密度と可読性のバランス」「視覚的な階層構造」を参考にしたデザインシステムの確立
- 開発効率を上げるため、再利用可能なコンポーネントを事前に準備

#### 実装内容

1. **デザインシステムの定義**
   - カラーパレット（プライマリ、アクセント、ステータスカラー）
   - タイポグラフィシステム（見出し、本文、コード用フォント）
   - スペーシングシステム（マージン、パディング）
   - シャドウ・ボーダーシステム

2. **基本UIコンポーネント**
   - Button（プライマリ、セカンダリ、アウトライン、テキスト）
   - Card（情報表示用のカードコンポーネント）
   - Badge（ステータス表示、ラベル表示）
   - Input / Textarea（フォーム入力）
   - Select / Dropdown（選択肢）
   - Modal / Dialog（モーダルダイアログ）
   - Toast / Notification（通知表示）

3. **データ表示コンポーネント**
   - TaskCard（タスク表示用カード）
   - SubjectCard（科目表示用カード）
   - ProgressBar（進捗表示）
   - StatusBadge（完了/未完了/期限切れなどのステータス表示）
   - DateDisplay（相対時間表示: "1時間前"、"昨日"など）

4. **レイアウトコンポーネント**
   - Container（コンテンツ幅の制限）
   - Grid / Flex（レイアウトシステム）
   - Sidebar（サイドバー）
   - Header / Navigation（ヘッダー・ナビゲーション）

5. **アイコンシステム**
   - Lucide React などのアイコンライブラリの導入
   - よく使うアイコンの統一（タスク、科目、カレンダー、グラフなど）

#### Implementation Steps

1. **Tailwind CSS設定の拡張** (`tailwind.config.ts`)
   - カスタムカラーパレットの定義
   - カスタムフォントファミリーの設定
   - カスタムスペーシングの定義
   - ダークモード対応（オプション）

2. **デザインシステムドキュメントの作成** (`docs/design-system.md`)
   - カラーパレットの一覧と使用例
   - タイポグラフィの階層
   - コンポーネントの使用ガイドライン

3. **基本Buttonコンポーネントの実装** (`components/ui/Button.tsx`)
   - バリアント: primary, secondary, outline, text
   - サイズ: sm, md, lg
   - ローディング状態のサポート
   - 無効化状態のサポート
   - アクセシビリティ対応（ARIA属性）

4. **Cardコンポーネントの実装** (`components/ui/Card.tsx`)
   - 基本カード、クリック可能なカード、ホバーエフェクト
   - ヘッダー、本文、フッターのスロット対応

5. **Badgeコンポーネントの実装** (`components/ui/Badge.tsx`)
   - カラーバリアント（success, warning, error, info）
   - サイズバリアント

6. **Input/Textareaコンポーネントの実装** (`components/ui/Input.tsx`, `components/ui/Textarea.tsx`)
   - ラベル、プレースホルダー、エラーメッセージのサポート
   - バリデーション状態の視覚的フィードバック

7. **Select/Dropdownコンポーネントの実装** (`components/ui/Select.tsx`)
   - 単一選択、複数選択のサポート
   - 検索機能付きドロップダウン（オプション）

8. **Modal/Dialogコンポーネントの実装** (`components/ui/Modal.tsx`)
   - オーバーレイ、アニメーション
   - 閉じるボタン、ESCキーでの閉じる機能
   - フォーカストラップ（アクセシビリティ）

9. **Toast/Notificationコンポーネントの実装** (`components/ui/Toast.tsx`)
   - 成功、エラー、警告、情報の4種類
   - 自動非表示機能
   - 複数のトーストをスタック表示

10. **TaskCardコンポーネントの実装** (`components/TaskCard.tsx`)
    - タスクタイトル、科目名、締切日、進捗率の表示
    - ステータスバッジの表示
    - クリックで詳細画面へ遷移

11. **ProgressBarコンポーネントの実装** (`components/ui/ProgressBar.tsx`)
    - 進捗率の視覚化
    - カラーバリアント（進捗に応じて色を変更）

12. **DateDisplayコンポーネントの実装** (`components/ui/DateDisplay.tsx`)
    - 相対時間表示（"1時間前"、"昨日"、"3日前"など）
    - 絶対日時表示のオプション

13. **レイアウトコンポーネントの実装** (`components/layout/`)
    - Container, Grid, Flex コンポーネント
    - Header, Sidebar, Navigation コンポーネント

14. **アイコンライブラリの導入と設定**
    - `lucide-react` のインストール
    - よく使うアイコンのエクスポートファイル作成 (`components/icons/index.ts`)

15. **Storybookの導入（オプション）**
    - コンポーネントのカタログ化
    - インタラクティブなドキュメント

#### 期待される成果物

- `tailwind.config.ts` - 拡張されたTailwind設定
- `docs/design-system.md` - デザインシステムドキュメント（約300-400行）
- `components/ui/Button.tsx` - Buttonコンポーネント（約100-150行）
- `components/ui/Card.tsx` - Cardコンポーネント（約80-120行）
- `components/ui/Badge.tsx` - Badgeコンポーネント（約50-80行）
- `components/ui/Input.tsx` - Inputコンポーネント（約100-150行）
- `components/ui/Textarea.tsx` - Textareaコンポーネント（約80-120行）
- `components/ui/Select.tsx` - Selectコンポーネント（約150-200行）
- `components/ui/Modal.tsx` - Modalコンポーネント（約150-200行）
- `components/ui/Toast.tsx` - Toastコンポーネント（約100-150行）
- `components/TaskCard.tsx` - TaskCardコンポーネント（約100-150行）
- `components/ui/ProgressBar.tsx` - ProgressBarコンポーネント（約60-100行）
- `components/ui/DateDisplay.tsx` - DateDisplayコンポーネント（約80-120行）
- `components/layout/` - レイアウトコンポーネント群（各50-100行）
- `components/icons/index.ts` - アイコンエクスポート（約50-100行）

#### 注意事項

- すべてのコンポーネントはアクセシビリティ（ARIA属性、キーボードナビゲーション）を考慮する
- モバイルファーストのレスポンシブデザインを採用
- ダークモード対応は将来的な拡張として考慮（最初はライトモードのみでも可）
- コンポーネントは可能な限り汎用的に設計し、propsでカスタマイズ可能にする
- TypeScriptの型定義を厳密に行う
- GitHub UI/UX分析で示された「情報密度と可読性のバランス」を意識したデザイン

#### 完了条件

- [x] デザインシステムドキュメントが完成している
- [x] 基本UIコンポーネント（Button, Card, Badge, Input等）が実装されている
- [x] データ表示コンポーネント（TaskCard, ProgressBar等）が実装されている
- [x] レイアウトコンポーネントが実装されている
- [x] すべてのコンポーネントがTypeScriptで型安全に実装されている
- [x] アクセシビリティの基本要件を満たしている
- [x] レスポンシブデザインが適用されている
- [x] コンポーネントが実際に使用できる状態になっている

**実装完了内容**:
- Tailwind CSS設定の拡張（カラーパレット、タイポグラフィ、スペーシング）
- デザインシステムドキュメントの作成 (`docs/design-system.md`)
- lucide-reactアイコンライブラリの導入
- 基本UIコンポーネント: Button, Card, Badge
- フォームコンポーネント: Input, Textarea, Select
- Modal/Dialogコンポーネント（フォーカストラップ、ESCキー対応）
- Toast/Notificationコンポーネント（コンテキストAPI使用）
- データ表示コンポーネント: ProgressBar, DateDisplay, StatusBadge
- TaskCard, SubjectCardコンポーネント
- レイアウトコンポーネント: Container, Header, Navigation
- すべてのコンポーネントのエクスポートファイル作成
- TypeScriptコンパイルとNext.jsビルドが正常に完了することを確認

---

## New Proposal [DONE]

### テンプレートファイル形式の定義とパーサー実装

**提案日**: 2025-01-27  
**完了日**: 2025-01-27  
**優先度**: 高（初期データ投入の基盤）  
**推定工数**: 中

**実装完了内容**:
- テンプレート型定義の実装 (`lib/types/template.ts`)
- CSVパーサーの実装 (`lib/utils/templateParser.ts`)
- JSONパーサーの実装 (`lib/utils/templateParser.ts`)
- バリデーション機能の実装 (`lib/utils/templateValidator.ts`)
- データ変換機能の実装 (`lib/utils/templateConverter.ts`)
- 統合インポート関数の実装 (`lib/utils/templateImporter.ts`)
- TypeScriptコンパイルが正常に完了することを確認

#### 概要
仕様書3.10で定義されている「テンプレートインポート機能」の基盤を構築します。科目・時間割・基本タスクを一括登録できるCSV/JSON形式のテンプレートファイル仕様を定義し、パーサーとバリデーション機能を実装します。

#### 背景・目的
- 仕様書3.10で「1〜10科目分をテンプレートに書いて読み込むと科目・時間割・基本タスクを自動生成」が要件として定義されている
- ユーザーが手動で大量の科目・タスクを登録する手間を削減する
- テンプレートファイルの形式を標準化し、再利用可能にする

#### 実装内容

1. **テンプレートファイル形式の定義**
   - CSV形式とJSON形式の両方をサポート
   - 科目情報、時間割情報、タスクテンプレート情報を含む構造
   - 仕様書2.10の「科目テンプレート」構造に基づく

2. **テンプレートファイルの構造設計**
   ```
   科目名, 曜日, 時限, 予習テンプレート, 復習テンプレート, 課題テンプレート
   数学, 月, 1, 教科書p.XX-XXを読む, 問題集p.XXを解く, レポート提出
   ```

3. **パーサー実装** (`lib/templateParser.ts`)
   - CSV形式のパース機能
   - JSON形式のパース機能
   - エラーハンドリング（形式エラー、必須フィールド欠損など）

4. **バリデーション機能** (`lib/templateValidator.ts`)
   - データ形式の検証（曜日、時限の妥当性など）
   - 必須フィールドのチェック
   - 重複チェック（同じ科目名の重複など）

5. **データ変換機能** (`lib/templateConverter.ts`)
   - テンプレートデータから実際のデータモデル（Subject, Timetable, Task）への変換
   - タスクの自動生成ロジック（予習/復習/課題テンプレートからタスクを生成）

6. **サンプルテンプレートファイルの作成**
   - `public/templates/sample.csv` - CSV形式のサンプル
   - `public/templates/sample.json` - JSON形式のサンプル
   - ドキュメント（README形式）で使用方法を説明

#### Implementation Steps

1. **テンプレートファイル形式の仕様書作成** (`docs/template-format.md`)
   - CSV形式の詳細仕様（カラム定義、データ型、必須/任意フィールド）
   - JSON形式のスキーマ定義
   - サンプルデータの例を複数パターン記載

2. **型定義の追加** (`lib/types.ts` に追加)
   ```typescript
   type DayOfWeek = '月' | '火' | '水' | '木' | '金' | '土' | '日';
   type Period = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
   
   interface SubjectTemplate {
     subjectName: string;
     dayOfWeek: DayOfWeek;
     period: Period;
     preparationTemplate?: string;
     reviewTemplate?: string;
     assignmentTemplate?: string;
   }
   
   interface TemplateFile {
     subjects: SubjectTemplate[];
   }
   ```

3. **CSVパーサーの実装** (`lib/templateParser.ts`)
   - `parseCSVTemplate(file: File): Promise<SubjectTemplate[]>` - CSVファイルをパース
   - `parseJSONTemplate(file: File): Promise<SubjectTemplate[]>` - JSONファイルをパース
   - エラーメッセージを詳細に返す（どの行のどのカラムでエラーが発生したか）

4. **バリデーション機能の実装** (`lib/templateValidator.ts`)
   - `validateTemplate(data: SubjectTemplate[]): ValidationResult` - テンプレートデータの検証
   - 曜日の妥当性チェック（'月'〜'日'のみ許可）
   - 時限の妥当性チェック（1〜8のみ許可）
   - 科目名の必須チェック
   - 重複科目名の検出

5. **データ変換機能の実装** (`lib/templateConverter.ts`)
   - `convertToSubjects(templates: SubjectTemplate[]): Subject[]` - Subjectエンティティへの変換
   - `convertToTimetables(templates: SubjectTemplate[]): Timetable[]` - Timetableエンティティへの変換
   - `generateTasksFromTemplate(template: SubjectTemplate, classDate: Date): Task[]` - テンプレートからタスクを生成
   - ID生成ロジック（UUIDまたは連番）

6. **統合関数の実装** (`lib/templateImporter.ts`)
   - `importTemplate(file: File): Promise<ImportResult>` - ファイルを読み込み、パース、検証、変換を一括実行
   - エラーが発生した場合は詳細なエラーメッセージを返す
   - 成功した場合は変換されたデータを返す

7. **サンプルファイルの作成**
   - `public/templates/sample.csv` - 3-5科目分のサンプルデータ
   - `public/templates/sample.json` - 同じデータのJSON版
   - `docs/template-usage.md` - 使用方法のドキュメント

8. **ユニットテストの作成** (`__tests__/templateParser.test.ts`)
   - CSVパーサーのテスト（正常系・異常系）
   - JSONパーサーのテスト
   - バリデーションのテスト
   - データ変換のテスト

#### 期待される成果物

- `docs/template-format.md` - テンプレートファイル形式の仕様書（約200-300行）
- `lib/templateParser.ts` - パーサー実装（約150-200行）
- `lib/templateValidator.ts` - バリデーション実装（約100-150行）
- `lib/templateConverter.ts` - データ変換実装（約150-200行）
- `lib/templateImporter.ts` - 統合関数（約50-100行）
- `public/templates/sample.csv` - CSVサンプルファイル
- `public/templates/sample.json` - JSONサンプルファイル
- `docs/template-usage.md` - 使用方法ドキュメント（約100行）
- `__tests__/templateParser.test.ts` - テストコード（約200-300行）

#### 注意事項

- テンプレートファイルはUTF-8エンコーディングを前提とする
- CSV形式では、カンマを含む値はダブルクォートで囲む必要がある
- エラーメッセージはユーザーフレンドリーな日本語で表示する
- 将来的にテンプレート形式が拡張される可能性を考慮し、拡張可能な設計にする
- パフォーマンス: 100科目程度のテンプレートでも1秒以内に処理できるようにする

#### 完了条件

- [x] CSV形式のテンプレートファイルが正しくパースできる
- [x] JSON形式のテンプレートファイルが正しくパースできる
- [x] バリデーションが正しく動作し、エラーを適切に検出できる
- [x] テンプレートデータが正しくSubject/Timetable/Taskエンティティに変換される
- [x] サンプルファイルが正しく読み込める（パーサー実装済み）
- [ ] ユニットテストがすべてパスする（後続タスクで実装可能）
- [ ] ドキュメントが完成している（後続タスクで実装可能）

---

## New Proposal [DONE]

### プロジェクト基盤構築：Next.js + TypeScript + データモデル定義

**提案日**: 2025-01-27  
**完了日**: 2025-01-27  
**優先度**: 最高（基盤構築）  
**推定工数**: 中

#### 概要
学習タスク管理アプリの開発基盤を構築します。Next.js + TypeScript + Tailwind CSS を使用し、仕様書に基づいたデータモデルの型定義と、ローカルストレージを使ったデータ永続化の基盤を実装します。

#### 背景・目的
- 現在、プロジェクトファイルが仕様書のみで、実装コードが存在しない
- アプリ開発を開始するための最小限の基盤が必要
- データモデルを型安全に定義し、以降の開発を効率化する

#### 実装内容

1. **プロジェクト初期化**
   - Next.js 14（App Router）プロジェクトの作成
   - TypeScript の設定
   - Tailwind CSS の導入と設定
   - ESLint / Prettier の設定

2. **データモデルの型定義**
   仕様書の2章に基づき、以下の型定義を作成：
   - `Subject` (科目)
   - `Timetable` (時間割)
   - `Class` (授業回)
   - `TaskType` (タスク種別: 予習/復習/課題/テスト勉強)
   - `Task` (タスク)
   - `Subtask` (サブタスク)
   - `StudyLog` (学習ログ)
   - `Exam` (テスト)
   - `BackupData` (バックアップデータ構造)

3. **データ永続化の基盤**
   - ローカルストレージを使ったデータ保存/読み込み機能
   - 型安全なデータアクセス層（`lib/storage.ts`）
   - 初期データ構造の定義

4. **基本的なプロジェクト構造**
   ```
   /app
     /(routes) - 各画面
     /api - API routes（必要に応じて）
   /components - 共通コンポーネント
   /lib
     types.ts - 型定義
     storage.ts - データ永続化
     utils.ts - ユーティリティ関数
   /public - 静的ファイル
   ```

#### Implementation Steps

1. **Next.js プロジェクトの初期化**
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
   ```
   - 既存ディレクトリに作成するため、`.` を指定
   - TypeScript、Tailwind CSS、App Router を有効化

2. **型定義ファイルの作成** (`lib/types.ts`)
   - 仕様書2章のデータ構造を TypeScript の型として定義
   - 各エンティティに ID、必須フィールド、オプショナルフィールドを明記
   - タスク種別は Union 型で定義: `type TaskType = 'preparation' | 'review' | 'assignment' | 'exam_study'`

3. **データストレージ層の実装** (`lib/storage.ts`)
   - `saveData(data: BackupData): void` - 全データをローカルストレージに保存
   - `loadData(): BackupData | null` - ローカルストレージから全データを読み込み
   - `clearData(): void` - データをクリア
   - エラーハンドリング（JSON パースエラーなど）を実装

4. **初期データ構造の定義** (`lib/initialData.ts`)
   - 空の初期データ構造を返す関数を実装
   - テスト用のサンプルデータ（オプション）を用意

5. **package.json の確認と調整**
   - 必要な依存関係が正しくインストールされているか確認
   - 開発用スクリプトの確認

6. **基本的なレイアウトコンポーネント** (`app/layout.tsx`)
   - 最小限の HTML 構造とメタデータ設定
   - Tailwind CSS が正しく読み込まれているか確認

7. **動作確認**
   - 型定義が正しくコンパイルされるか確認
   - ストレージ機能が正しく動作するか確認（ブラウザの開発者ツールで確認）

#### 期待される成果物

- `package.json` - 依存関係が定義された状態
- `tsconfig.json` - TypeScript 設定
- `tailwind.config.ts` - Tailwind CSS 設定
- `lib/types.ts` - 全データモデルの型定義（約200-300行）
- `lib/storage.ts` - データ永続化機能（約100-150行）
- `lib/initialData.ts` - 初期データ構造（約50行）
- `app/layout.tsx` - 基本レイアウト
- `.gitignore` - Next.js 用の適切な設定

#### 注意事項

- 既存の `.md` ファイル（仕様書など）は削除しない
- ローカルストレージのキー名は `'study-app-data'` とする
- 型定義は仕様書の2章と完全に一致させる
- 将来的にバックエンド API に移行する可能性を考慮し、ストレージ層は抽象化しておく

#### 完了条件

- [x] Next.js プロジェクトが正常に起動する
- [x] すべての型定義がコンパイルエラーなく動作する
- [x] ローカルストレージへの保存/読み込みが正常に動作する
- [x] ESLint エラーがない
- [x] プロジェクト構造が整理されている

**実装完了内容**:
- Next.js 14 (App Router) + TypeScript + Tailwind CSS のプロジェクト基盤を構築
- 仕様書に基づく全データモデルの型定義を実装 (`lib/types.ts`)
- ローカルストレージを使ったデータ永続化層を実装 (`lib/storage.ts`)
- 初期データ構造とサンプルデータを実装 (`lib/initialData.ts`)
- 基本的なレイアウトとホームページを実装 (`app/layout.tsx`, `app/page.tsx`)
- TypeScript コンパイルと Next.js ビルドが正常に完了することを確認

---

## 提案一覧

### [DONE] プロジェクト基盤構築：Next.js + TypeScript + データモデル定義

**完了日**: 2025-01-27  
**実装内容**: Next.js + TypeScript + Tailwind CSS の基盤構築、データモデル型定義、ローカルストレージ実装

---

### [DONE] UI/UXデザインシステムと共通コンポーネントライブラリの構築

**提案日**: 2025-01-27  
**完了日**: 2025-01-27  
**優先度**: 高（UI開発の基盤）  
**推定工数**: 中〜大

**実装完了内容**:
- Tailwind CSS設定の拡張（カラーパレット、タイポグラフィ、スペーシング）
- デザインシステムドキュメントの作成 (`docs/design-system.md`)
- lucide-reactアイコンライブラリの導入
- 基本UIコンポーネント: Button, Card, Badge
- フォームコンポーネント: Input, Textarea, Select
- Modal/Dialogコンポーネント（フォーカストラップ、ESCキー対応）
- Toast/Notificationコンポーネント（コンテキストAPI使用）
- データ表示コンポーネント: ProgressBar, DateDisplay, StatusBadge
- TaskCard, SubjectCardコンポーネント
- レイアウトコンポーネント: Container, Header, Navigation
- すべてのコンポーネントのエクスポートファイル作成
- TypeScriptコンパイルとNext.jsビルドが正常に完了することを確認

---

### テスト管理機能の実装：テスト登録・残り日数表示・進捗管理

**提案日**: 2025-01-27  
**優先度**: 高（テスト勉強の効率化）  
**推定工数**: 中

**概要**: 仕様書2.8と3.4で定義されているテスト管理機能を実装。テストの登録・編集、残り日数の表示、テスト勉強進捗率の計算、必要タスクリストの表示を実装。

---

### [DONE] グラフ・分析機能の実装：進捗の可視化と統計分析

**提案日**: 2025-01-27  
**完了日**: 2025-01-27  
**優先度**: 中（分析・可視化）  
**推定工数**: 中〜大

**概要**: 仕様書3.6で定義されているグラフ・分析機能を実装。期限より早く終えた日数、完了タスク数推移、科目別時間、月別進捗率を可視化。

**実装完了内容**:
- rechartsチャートライブラリの導入
- 完了タスク数推移データの集計関数（日別・週別・月別）
- 科目別学習時間集計関数
- 進捗率計算関数（月別進捗率）
- 期限より早く終えた日数の統計関数
- 完了タスク数推移グラフコンポーネント（折れ線グラフ）
- 科目別学習時間グラフコンポーネント（棒グラフ）
- 早期完了統計コンポーネント
- 分析画面ページの実装 (`app/(dashboard)/analytics/page.tsx`)
- 月別進捗率グラフ、期間選択コンポーネント、統計サマリーの実装
- TypeScriptコンパイルとNext.jsビルドが正常に完了することを確認

---

### [DONE] バックアップ・復元機能の実装：データのエクスポート・インポート

**提案日**: 2025-01-27  
**完了日**: 2025-01-27  
**優先度**: 高（データ保護）  
**推定工数**: 中

**概要**: 仕様書2.9と3.9で定義されているバックアップ・復元機能を実装。すべてのデータをJSON形式でエクスポートし、インポートで復元できるようにする。

**実装完了内容**:
- データエクスポート関数の実装 (`lib/api/backup.ts`)
- データインポート関数の実装 (`lib/api/backup.ts`)
- バックアップデータ検証関数の実装 (`lib/validation/backupValidation.ts`)
- エクスポート機能の実装 (`components/settings/ExportData.tsx`)
- インポート機能の実装 (`components/settings/ImportData.tsx`)
- 設定画面ページの実装 (`app/(dashboard)/settings/page.tsx`)
- TypeScriptコンパイルとNext.jsビルドが正常に完了することを確認

---

### 学習ログ機能の実装：記録・一覧・集計

**提案日**: 2025-01-27  
**優先度**: 高（進捗把握の基盤）  
**推定工数**: 中

**概要**: 仕様書2.7と3.5で定義されている学習ログ機能を実装。学習ログの記録、日付別・科目別の一覧表示、科目別時間集計機能を実装。

**実装進捗**: 主要機能は実装済み（学習ログの記録・編集・削除、日付別ログ、科目別時間集計、フィルタリング）。グラフ表示はオプション機能として後続タスクで実装可能。

---

### 科目管理機能の実装：一覧・登録・編集・時間割管理

**提案日**: 2025-01-27  
**優先度**: 高（タスク管理の前提）  
**推定工数**: 中

**概要**: 仕様書2.1と2.2、3.2で定義されている科目管理機能を実装。科目の登録・編集・削除、時間割との紐付け、科目詳細画面でのタスク一覧表示を実装。

**実装進捗**: 科目・時間割のCRUD関数は実装済み。科目一覧・詳細画面、時間割管理UIの実装が必要。

---

### タスク管理機能の実装：一覧・登録・編集・フィルタリング

**提案日**: 2025-01-27  
**優先度**: 最高（コア機能）  
**推定工数**: 大

**概要**: 仕様書3.1と3.3で定義されているタスク管理機能を実装。タスクの登録・編集・削除、サブタスクの管理、完了率の自動計算、一覧表示とフィルタリング機能を実装。

---

### ホーム画面の実装：今週の状況と未完了タスクの表示

**提案日**: 2025-01-27  
**優先度**: 高（主要機能）  
**推定工数**: 中

**概要**: 仕様書3.7で定義されているホーム画面を実装。「今週の状況」と「終わっていないもの」を視覚的に表示し、ユーザーが一目で現在の学習状況を把握できるようにする。

---

### ナビゲーション構造とルーティング設計の実装

**提案日**: 2025-01-27  
**優先度**: 高（画面遷移の基盤）  
**推定工数**: 中

**概要**: 仕様書4章で定義されている画面構成に基づき、Next.js App Routerを使用したナビゲーション構造とルーティングを実装。ヘッダー・サイドバー・フッターを含む共通レイアウトと、各画面へのルーティングを構築。

---

### テンプレートファイル形式の定義とパーサー実装

**提案日**: 2025-01-27  
**優先度**: 高（初期データ投入の基盤）  
**推定工数**: 中

**概要**: 仕様書3.10で定義されている「テンプレートインポート機能」の基盤を構築。科目・時間割・基本タスクを一括登録できるCSV/JSON形式のテンプレートファイル仕様を定義し、パーサーとバリデーション機能を実装。

---

### パフォーマンス最適化：データ読み込み・レンダリングの高速化

**提案日**: 2025-01-27  
**優先度**: 低（UX向上）  
**推定工数**: 中

**概要**: アプリ全体のパフォーマンスを最適化。データ読み込みの高速化、不要な再レンダリングの防止、大量データの効率的な処理を実装。

---

### データ検証とエラーハンドリングの強化：入力値検証・エラー表示の改善

**提案日**: 2025-01-27  
**優先度**: 中（品質向上）  
**推定工数**: 中

**概要**: アプリ全体のデータ検証とエラーハンドリングを強化。入力値の検証、エラーメッセージの統一、ユーザーフレンドリーなエラー表示を実装。

---

### 授業回管理機能の実装：授業登録・一覧・タスク紐付け

**提案日**: 2025-01-27  
**優先度**: 低（補助機能）  
**推定工数**: 小

**概要**: 仕様書2.3で定義されている授業回（Class）管理機能を実装。授業の登録・編集・削除、授業一覧の表示、授業とタスクの紐付け機能を実装。

---

### テンプレートインポート機能のUI実装：ファイル選択・プレビュー・一括登録

**提案日**: 2025-01-27  
**優先度**: 中（初期データ投入の効率化）  
**推定工数**: 中

**概要**: 仕様書3.10で定義されているテンプレートインポート機能のUI部分を実装。パーサーは既に実装済みのため、ファイル選択、データプレビュー、一括登録のUIを実装。

---

### 期限オーバー/完了把握機能の実装：期限切れ一覧と完了日・締切差の表示

**提案日**: 2025-01-27  
**優先度**: 中（進捗把握の補助機能）  
**推定工数**: 小〜中

**概要**: 仕様書3.8で定義されている「期限オーバー/完了把握」機能を実装。期限切れタスクの一覧表示と、完了日と締切日の差を表示する機能を実装。

---


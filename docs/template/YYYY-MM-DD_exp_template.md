# コアプリロードシステムの導入

**日付**: 2026-02-13  
**カテゴリ**: 設計・実装  
**影響範囲**: `src/core/scenes/CorePreloadScene.ts`, `src/game/scenes/PreloadScene.ts`

## 変更の背景

複数のゲームプロジェクトで共通のアセット読み込み処理とローディングバーUIを使い回すため、再利用可能なコアプリロードシステムを導入しました。これまでは各プロジェクトで個別にローディング処理を実装していたため、コードの重複とメンテナンスコストが課題となっていました。

## 変更内容

### 主な変更点

- `CorePreloadScene` を新規作成し、汎用的なローディングバーとアセット読み込み構造を実装
- `PreloadScene` を `CorePreloadScene` を継承する形に変更
- ローディングバーのスタイル（色、サイズ、位置）を定数化し、カスタマイズ可能に
- プログレスバーとパーセンテージ表示を標準実装

### 影響を受けるファイル

- `src/core/scenes/CorePreloadScene.ts` (新規作成)
- `src/game/scenes/PreloadScene.ts` (リファクタリング)

### コード構造

```typescript
// CorePreloadScene: 共通のローディング処理
export abstract class CorePreloadScene extends BaseScene {
    protected abstract loadAssets(): void; // 各ゲームで実装

    // 共通のローディングバー描画処理
    private createLoadingBar(): void { ... }
}

// PreloadScene: ゲーム固有のアセット読み込み
export class PreloadScene extends CorePreloadScene {
    protected loadAssets(): void {
        // ゲーム固有のアセットを読み込む
    }
}
```

## 設計判断

### テンプレートメソッドパターンの採用

`CorePreloadScene` で共通処理を実装し、各ゲームの `PreloadScene` で `loadAssets()` をオーバーライドする形にしました。これにより:

- **利点**: コアの変更が各プロジェクトに自動的に反映される
- **利点**: ローディングバーのデザインが統一される
- **欠点**: 高度なカスタマイズには制約がある

### 他の選択肢との比較

- **コンポジションパターン**: より柔軟だが、各プロジェクトでの設定が煩雑になる
- **ユーティリティ関数**: シンプルだが、状態管理が難しくなる

プロジェクト間の一貫性を重視し、テンプレートメソッドパターンを選択しました。

## 今後の課題・注意点

- **カスタマイズの制限**: ローディングバーのデザインをさらにカスタマイズしたい場合、定数の拡張が必要
- **複雑なアセット管理**: 遅延読み込みやアセットバンドルには対応していない
- **エラーハンドリング**: アセット読み込み失敗時の処理を今後強化する必要がある

## 参考資料

- [Phaser 3 Loader Events](https://photonstorm.github.io/phaser3-docs/Phaser.Loader.LoaderPlugin.html)
- 会話履歴: `f8234729-3747-4144-bdb1-814f9fac9b9c` (Migrating Preload Logic)

# チュートリアルシステム

Phaser 3用の汎用的なチュートリアルシステム。指定した領域のみを操作可能にし、ステップごとにガイドを表示します。

## 特徴

- ✅ **スポットライト機能**: 指定領域のみ操作可能、他は黒いオーバーレイで覆う
- ✅ **自動位置調整**: モーダルがスポットライトと重ならないよう自動配置
- ✅ **柔軟なステップ管理**: State Patternによる明確な状態遷移
- ✅ **イベント駆動**: Observer Patternによる疎結合な通信
- ✅ **アニメーション**: スムーズなフェードイン/アウト
- ✅ **カスタマイズ可能**: 矩形/円形スポットライト、位置指定、完了条件など

## アーキテクチャ

### 設計パターン

- **State Pattern**: チュートリアルの状態（idle/active/paused/completed/skipped）を明確に管理
- **Observer Pattern**: EventEmitterを使用したイベント駆動通信
- **Factory Pattern**: TutorialOverlayとTutorialModalの生成を分離
- **関心の分離**: Manager（制御）、Overlay（ビジュアル）、Modal（UI）を完全に分離

### ファイル構成

```
core/
├── managers/
│   └── TutorialManager.ts      # チュートリアル全体の進行管理
├── ui/
│   ├── TutorialOverlay.ts      # オーバーレイとスポットライト
│   └── TutorialModal.ts        # チュートリアル用モーダル
└── types/
    └── tutorial.ts             # 型定義（循環参照回避）
```

## 使い方

### 基本的な使用例

```typescript
// チュートリアルを開始
this.tutorialManager.start([
    {
        id: "step1",
        text: "ようこそ！まずはこのボタンをクリックしてください",
        spotlightArea: {
            x: 100,
            y: 200,
            width: 120,
            height: 50,
            shape: "rectangle",
        },
        modalPosition: "auto",
    }
]);
```

## API リファレンス

### TutorialStep
- `id`: 一意のID
- `text`: 表示テキスト
- `spotlightArea`: スポットライトの座標とサイズ
- `modalPosition`: モーダルの配置（auto/top/bottom/left/right）
- `completeCondition`: 次のステップへ進むための条件関数
- `onStart`: ステップ開始時のコールバック
- `onComplete`: ステップ完了時のコールバック

## 実装の詳細
`TutorialOverlay` は `GeometryMask` を使用してスポットライトを実装します。モーダルの配置はスポットライトの位置に応じて自動計算されます。

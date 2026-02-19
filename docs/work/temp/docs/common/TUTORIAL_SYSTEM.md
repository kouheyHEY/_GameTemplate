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
import { TutorialManager } from "@/core";

export class GameScene extends Phaser.Scene {
    private tutorialManager!: TutorialManager;

    create() {
        // チュートリアルマネージャーを初期化
        this.tutorialManager = new TutorialManager(this);

        // イベントリスナーを設定
        this.tutorialManager.on("tutorial-complete", () => {
            console.log("チュートリアル完了！");
            // セーブデータに完了フラグを保存などの処理
        });

        this.tutorialManager.on("tutorial-skip", () => {
            console.log("チュートリアルをスキップしました");
        });

        this.tutorialManager.on("step-start", (step) => {
            console.log(`ステップ開始: ${step.id}`);
        });

        // チュートリアルを開始
        this.startTutorial();
    }

    private startTutorial() {
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
                    radius: 8,
                },
                modalPosition: "auto",
            },
            {
                id: "step2",
                text: "このアイテムをドラッグ＆ドロップしてください",
                spotlightArea: {
                    x: 300,
                    y: 150,
                    width: 80,
                    height: 80,
                    shape: "circle",
                },
                completeCondition: () => {
                    // アイテムが移動されたかチェック
                    return this.checkItemMoved();
                },
            },
            {
                id: "step3",
                text: "チュートリアル完了です！",
                spotlightArea: null, // 全画面オーバーレイ
                modalPosition: "auto",
            },
        ]);
    }
}
```

### 高度な使用例：コールバック付き

```typescript
this.tutorialManager.start([
    {
        id: "intro",
        text: "ゲームの基本的な操作を学びましょう",
        spotlightArea: null,
        onStart: () => {
            // ステップ開始時の処理
            this.pauseGameLogic();
        },
        onComplete: () => {
            // ステップ完了時の処理
            this.resumeGameLogic();
        },
    },
    {
        id: "move-character",
        text: "キャラクターを移動させてください",
        spotlightArea: {
            x: 400,
            y: 300,
            width: 200,
            height: 200,
        },
        completeCondition: () => {
            // キャラクターが一定距離移動したか
            return this.player.hasMoved;
        },
        onComplete: () => {
            this.player.hasMoved = false;
        },
    },
]);
```

### モーダルの位置を指定

```typescript
{
    id: 'top-ui',
    text: 'この画面上部のUIについて説明します',
    spotlightArea: { x: 0, y: 0, width: 800, height: 100 },
    modalPosition: 'bottom' // 'top' | 'bottom' | 'left' | 'right' | 'auto'
}
```

### 円形スポットライト

```typescript
{
    id: 'circular-highlight',
    text: 'このボタンに注目！',
    spotlightArea: {
        x: 250,
        y: 250,
        width: 100,
        height: 100,
        shape: 'circle' // 円形にする
    }
}
```

## API リファレンス

### TutorialManager

#### コンストラクタ

```typescript
constructor(scene: Phaser.Scene, debug?: boolean)
```

#### メソッド

- `start(steps: TutorialStep[])`: チュートリアルを開始
- `nextStep()`: 次のステップへ進む（自動的に呼ばれるが、手動でも呼べる）
- `skip()`: チュートリアルをスキップ
- `pause()`: チュートリアルを一時停止
- `resume()`: チュートリアルを再開
- `getState()`: 現在の状態を取得
- `getCurrentStep()`: 現在のステップを取得
- `destroy()`: チュートリアルマネージャーを破棄

#### イベント

- `tutorial-start`: チュートリアル開始時
- `step-start`: 各ステップ開始時（引数: step）
- `step-complete`: 各ステップ完了時（引数: step）
- `tutorial-complete`: チュートリアル完了時
- `tutorial-skip`: チュートリアルスキップ時
- `tutorial-pause`: 一時停止時
- `tutorial-resume`: 再開時

### TutorialStep

```typescript
interface TutorialStep {
    id: string; // ステップID（一意）
    text: string; // 表示テキスト
    spotlightArea: SpotlightArea | null; // スポットライト領域
    modalPosition?: "top" | "bottom" | "left" | "right" | "auto";
    completeCondition?: () => boolean; // 完了条件
    onStart?: () => void; // 開始時コールバック
    onComplete?: () => void; // 完了時コールバック
}
```

### SpotlightArea

```typescript
interface SpotlightArea {
    x: number; // X座標
    y: number; // Y座標
    width: number; // 幅
    height: number; // 高さ
    shape?: "rectangle" | "circle"; // 形状
    radius?: number; // 角の丸み（rectangle時）
}
```

## 実装の詳細

### 1. オーバーレイとスポットライト

`TutorialOverlay`は、Phaser GraphicsとGeometryMaskを使用して、画面全体を覆うオーバーレイと、指定領域を切り抜くスポットライトを実装しています。

- **オーバーレイ**: 黒い半透明の矩形（透明度0.7）
- **スポットライト**: GeometryMaskの反転マスクで切り抜き
- **アニメーション**: フェードイン/アウトで自然な遷移

### 2. モーダルの自動配置

`TutorialManager.calculateModalPosition`メソッドは、以下の優先順位でモーダルを配置します：

1. スポットライトの下
2. スポットライトの上
3. スポットライトの右
4. スポットライトの左
5. どこにも配置できない場合は画面中央

### 3. 完了条件の監視

`completeCondition`が指定されている場合、100msごとに条件をチェックし、trueになったら自動的に次のステップへ進みます。

### 4. 循環参照の回避

型定義を`core/types/tutorial.ts`に分離することで、`TutorialManager` ↔ `TutorialOverlay`間の循環参照を回避しています。

## カスタマイズ

### オーバーレイの色と透明度

`TutorialOverlay.ts`の定数を変更：

```typescript
private readonly overlayColor: number = 0x000000;  // 色
private readonly overlayAlpha: number = 0.7;        // 透明度
```

### モーダルのスタイル

`TutorialModal`のコンストラクタで設定を渡す：

```typescript
new TutorialModal(this.scene, {
    width: 500,
    backgroundColor: 0x2a2a3e,
    backgroundAlpha: 0.98,
    fontSize: "20px",
    fontFamily: "Arial",
    textColor: "#ffffff",
});
```

### アニメーション時間

```typescript
private readonly animationDuration: number = 300; // ミリ秒
```

## トラブルシューティング

### スポットライトが表示されない

- `spotlightArea`の座標とサイズが正しいか確認
- `shape`プロパティが正しく設定されているか確認

### モーダルが表示されない

- `text`が空でないか確認
- 画面サイズが十分か確認（最小400x200推奨）

### 完了条件が機能しない

- `completeCondition`が正しく実装されているか確認
- 条件が常にfalseを返していないか確認（デバッグログを追加）

## ベストプラクティス

1. **ステップIDは一意に**: デバッグやログで識別しやすくなる
2. **スポットライトは余裕を持って**: 操作対象より少し大きめに設定
3. **テキストは簡潔に**: 長すぎるとモーダルが大きくなりすぎる
4. **完了条件は確実に**: ユーザーが詰まらないよう、達成可能な条件を設定
5. **イベントを活用**: 進行状況をログに記録し、デバッグに役立てる

## ライセンス

プロジェクト全体のライセンスに従います。

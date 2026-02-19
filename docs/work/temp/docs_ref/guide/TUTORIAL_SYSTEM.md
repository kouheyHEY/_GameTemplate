# チュートリアルシステム

Phaser 3用の汎用チュートリアルシステムの仕様と使い方です。

## 概要

画面の一部をスポットライトで強調し、操作を誘導するシステムです。
状態管理 (State Pattern) とイベント駆動 (Observer Pattern) を採用しており、ゲームロジックと疎結合になっています。

## 構成要素

1. **TutorialManager**: チュートリアルの進行管理
2. **TutorialOverlay**: 画面を暗くし、指定箇所だけ明るくする演出
3. **TutorialModal**: 説明テキストを表示するウィンドウ

## 使い方

### 1. 初期化

シーンの `create` メソッドでインスタンス化します。

```typescript
import { TutorialManager } from "@/core/managers/TutorialManager";

export class GameScene extends Phaser.Scene {
    private tutorialManager: TutorialManager;

    create() {
        this.tutorialManager = new TutorialManager(this);

        // 完了時の処理
        this.tutorialManager.on("tutorial-complete", () => {
            console.log("チュートリアル終了");
        });
    }
}
```

### 2. ステップの定義と開始

ステップデータの配列を渡して開始します。

```typescript
this.tutorialManager.start([
    {
        id: "step1",
        text: "ここをクリックしてユニットを配置します",
        spotlightArea: {
            x: 100,
            y: 200,
            width: 64,
            height: 64,
            shape: "rectangle",
        },
        modalPosition: "bottom",
    },
    {
        id: "step2",
        text: "敵を攻撃しましょう！",
        spotlightArea: {
            x: 300,
            y: 200,
            width: 100,
            height: 100,
            shape: "circle",
        },
        completeCondition: () => this.enemy.isDead(), // 条件達成で自動進行
    },
]);
```

### 3. API

- `start(steps)`: チュートリアル開始
- `nextStep()`: 次へ進む (手動)
- `skip()`: 中断して終了
- `pause() / resume()`: 一時停止/再開

## カスタマイズ

- **オーバーレイの色**: `TutorialOverlay.ts` の `overlayColor`, `overlayAlpha` を変更
- **モーダルのデザイン**: `TutorialModal.ts` のスタイル設定を変更

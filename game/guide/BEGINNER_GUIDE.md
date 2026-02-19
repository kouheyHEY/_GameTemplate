# 初学者向けゲーム開発ガイド (Beginner's Guide)

このテンプレートを使って、最初のゲームを作るためのステップバイステップガイドです。

## 1. 準備

まず、`_GameTemplate` フォルダをコピーして、あなたのプロジェクト名（例: `MyFirstGame`）に変更してください。
その後、ターミナルでそのフォルダを開き、以下のコマンドを実行して準備を完了します。

```bash
npm install
npm run dev
```

ブラウザが開き、黒い画面（またはテンプレートの初期画面）が表示されれば成功です！

## 2. 新しいシーンを作る

ゲームの画面（タイトル画面、プレイ画面など）は「シーン」と呼ばれます。
`src/game/scenes/` フォルダに新しいファイル `MyScene.ts` を作ってみましょう。

```typescript
import { BaseScene } from "../../core/BaseScene";

export class MyScene extends BaseScene {
    constructor() {
        super("MyScene"); // シーンの名前
    }

    create() {
        // ここに初期化処理を書く
        super.create(); // BaseSceneの機能を有効にするために必要

        console.log("MyScene started!");
    }

    update(time: number, delta: number) {
        // ここに毎フレームの処理を書く
    }
}
```

## 3. 画像を表示する

1. 画像ファイル（例: `player.png`）を `public/assets/img/` に入れます。
2. `src/game/scenes/PreloadScene.ts` で画像を読み込みます。

```typescript
// PreloadScene.ts
loadAssets(): void {
    this.load.image("player", "assets/img/player.png");
}
```

3. `MyScene.ts` で画像を表示します。

```typescript
// MyScene.ts
create() {
    super.create();

    // 画面中央に表示
    const x = this.cameras.main.width / 2;
    const y = this.cameras.main.height / 2;

    this.add.sprite(x, y, "player");
}
```

## 4. 音を鳴らす

このテンプレートには `SoundManager` が最初から組み込まれています。

1. 音声ファイル（例: `jump.mp3`）を `public/assets/sound/` に入れます。
2. `PreloadScene.ts` で読み込みます。

```typescript
// PreloadScene.ts
loadAssets(): void {
    // ...画像の読み込み...
    this.load.audio("jump", "assets/sound/jump.mp3");
}
```

3. `MyScene.ts` で鳴らします。

```typescript
// MyScene.ts
create() {
    super.create();

    // クリックしたら音を鳴らす
    this.input.on("pointerdown", () => {
        this.soundManager.playSe("jump");
    });
}
```

## 5. UI（ボタン）を作る

便利な `Button` クラスが用意されています。

```typescript
import { Button } from "../../core/ui/Button";

// MyScene.ts
create() {
    super.create();

    // ボタンを作成
    new Button(this, 100, 100, "Start Game", () => {
        alert("Button Clicked!");
    });
}
```

## 6. 次のステップ

- `src/game/scenes/GameScene.ts` を見て、実際に動いているコードを参考にしましょう。
- Phaser 3 の公式サイト（英語）や、Qiitaなどの日本語記事も参考になります。
- 困ったら、このガイドの上の階層にある `ADVANCED_GUIDE.md` も見てみてください。

# 上級者向け開発ガイド (Advanced Guide)

このドキュメントでは、`_GameTemplate` のコアアーキテクチャと、大規模開発に向けた拡張方法について解説します。

## 1. コアアーキテクチャの概要

本テンプレートは、**再利用性 (Portability)** と **関心の分離 (Separation of Concerns)** を最優先に設計されています。

### Service Locator パターン

グローバルな機能は `src/core/ServiceLocator.ts` を通じてアクセスします。
これにより、シングルトンの乱立を防ぎ、将来的な依存性の注入 (DI) やモック化を容易にしています。

```typescript
// 登録 (main.ts)
ServiceLocator.register("SoundManager", new SoundManager());

// 利用 (BaseScene内など)
const soundManager = ServiceLocator.get<SoundManager>("SoundManager");
```

### BaseScene の拡張

すべてのクゲームシーンは `src/core/BaseScene.ts` を継承することを推奨します。
これにより、以下の機能が自動的に利用可能になります。

- `this.soundManager`: サウンド管理へのアクセス
- `this.inputManager`: 入力管理へのアクセス
- `shutdown` 時の自動クリーンアップ（イベントリスナーの解除など）

## 2. CorePreloadScene の仕組み

ローディング画面のロジックは `src/core/scenes/CorePreloadScene.ts` に集約されています。
ゲーム固有の処理は `loadAssets()` と `getNextSceneKey()` をオーバーライドするだけで実装可能です。

もしローディング画面のデザインを大幅に変更したい場合は、`CorePreloadScene` を直接修正するか、継承クラスで `createLoadingUI` メソッドをオーバーライドしてください（protectedにする必要があります）。

## 3. UIコンポーネントの作成

`src/core/ui` にあるコンポーネント（Button, Modal等）は、Phaserの `Container` を継承しています。
新しいUIコンポーネントを作る際も、同様のアプローチを推奨します。

```typescript
export class MyCustomUI extends Phaser.GameObjects.Container {
    constructor(scene: Phaser.Scene) {
        super(scene);
        this.scene.add.existing(this);
        // ...
    }
}
```

## 4. Electron ビルドのカスタマイズ

デスクトップ版のビルドには `electron-builder` を使用しています。
設定は `package.json` の `build` セクションに記述されています。

- **アイコン変更**: `public/icon.ico` (Windows) / `public/icon.icns` (Mac) を差し替えてください。
- **ウィンドウサイズ**: `electron/main.ts` の `mainWindow` 作成時のパラメータを変更してください。

## 5. ステートマシンの活用

複雑なキャラクターの挙動（待機、移動、攻撃、被ダメージ）を管理するために、`src/core/state/StateMachine.ts` の利用を検討してください。

```typescript
const stateMachine = new StateMachine(this, player);
stateMachine.addState("idle", new IdleState());
stateMachine.addState("walk", new WalkState());
stateMachine.setState("idle");
```

## 6. コアの更新について

`src/core` フォルダは、他のプロジェクトでも使い回せるように汎用的に作られています。
もし `src/core` を修正した場合は、変更内容を他のプロジェクトにも適用できるか（汎用的か）を検討し、可能であればテンプレート元の `src/core` にも反映させることをお勧めします。

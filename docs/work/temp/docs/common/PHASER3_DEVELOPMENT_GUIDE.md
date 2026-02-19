# Phaser 3 ゲーム開発ガイド

## 開発開始からリリースまでの完全ワークフロー

本ドキュメントは、Phaser 3を使用した本格的なゲーム開発における、プロフェッショナルな開発フローと設計指針をまとめたリファレンスです。

---

## 📋 目次

1. [プロジェクトセットアップ](#1-プロジェクトセットアップ)
2. [アーキテクチャ設計](#2-アーキテクチャ設計)
3. [開発フェーズ](#3-開発フェーズ)
4. [実装パターン](#4-実装パターン)
5. [最適化とデバッグ](#5-最適化とデバッグ)
6. [ビルドとデプロイ](#6-ビルドとデプロイ)
7. [保守とアップデート](#7-保守とアップデート)

---

## 1. プロジェクトセットアップ

### 1.1 技術スタック選定

#### 推奨構成

```
Phaser 3 (v3.60+)
├── TypeScript       # 型安全性と開発効率
├── Vite            # 高速な開発サーバー・ビルド
├── ESLint          # コード品質保証
└── Prettier        # コードフォーマット統一
```

#### パッケージ版対応（オプション）

```
Electron           # デスクトップアプリ化
├── electron-builder  # パッケージング
└── Vite統合         # ブラウザ版と共通コードベース
```

### 1.2 プロジェクト初期化

```bash
# プロジェクト作成
npm create vite@latest my-phaser-game -- --template vanilla-ts

# 必須パッケージインストール
npm install phaser

# 開発用パッケージ
npm install -D @types/node
npm install -D eslint prettier

# Electron対応（パッケージ版）
npm install -D electron electron-builder vite-plugin-electron
```

### 1.3 ディレクトリ構造設計

```
project-root/
├── src/
│   ├── main.ts                    # エントリーポイント
│   ├── scenes/                    # シーンクラス
│   │   ├── PreloadScene.ts
│   │   ├── TitleScene.ts
│   │   ├── GameScene.ts
│   │   └── GameOverScene.ts
│   ├── core/                      # コアシステム
│   │   ├── managers/              # マネージャークラス
│   │   │   ├── SoundManager.ts
│   │   │   ├── InputManager.ts
│   │   │   └── StateManager.ts
│   │   ├── ui/                    # UI コンポーネント
│   │   ├── utils/                 # ユーティリティ
│   │   └── types/                 # 型定義
│   ├── entities/                  # ゲームオブジェクト（Prefab）
│   │   ├── Player.ts
│   │   ├── Enemy.ts
│   │   └── Item.ts
│   ├── systems/                   # ゲームシステム
│   │   ├── CollisionSystem.ts
│   │   ├── ScoreSystem.ts
│   │   └── TutorialSystem.ts
│   ├── constants/                 # 定数定義
│   │   ├── Game.ts
│   │   ├── Colors.ts
│   │   └── Keys.ts
│   └── sprite/                    # カスタムスプライト
├── public/
│   └── assets/                    # アセットファイル
│       ├── img/
│       ├── sound/
│       └── font/
├── electron/                      # Electron用（パッケージ版）
│   ├── main.ts
│   └── preload.ts
├── docs/                          # ドキュメント
├── vite.config.ts
├── tsconfig.json
└── package.json
```

**設計原則：**

- **関心の分離**: シーン、マネージャー、エンティティを明確に分離
- **スケーラビリティ**: 機能追加時にファイル追加のみで対応可能
- **可読性**: ディレクトリ名で役割が明確にわかる

### 1.4 設定ファイル

#### tsconfig.json

```json
{
    "compilerOptions": {
        "target": "ES2020",
        "module": "ESNext",
        "lib": ["ES2020", "DOM"],
        "moduleResolution": "bundler",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "resolveJsonModule": true,
        "paths": {
            "@/*": ["./src/*"]
        }
    },
    "include": ["src/**/*"],
    "exclude": ["node_modules", "dist"]
}
```

#### vite.config.ts

```typescript
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    build: {
        target: "esnext",
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ["phaser"],
                },
            },
        },
    },
});
```

---

## 2. アーキテクチャ設計

### 2.1 設計原則

#### SOLID原則の適用

1. **単一責任の原則 (SRP)**
    - 1つのクラスは1つの責任のみを持つ
    - 例：`SoundManager`は音声管理のみ、`InputManager`は入力検出のみ

2. **開放閉鎖の原則 (OCP)**
    - 拡張に対して開いている、修正に対して閉じている
    - 例：`Factory`パターンで新しいエンティティ追加を容易に

3. **リスコフの置換原則 (LSP)**
    - 派生クラスは基底クラスと置き換え可能
    - 例：`BaseTile`を継承したすべてのタイルは同じインターフェースで扱える

4. **インターフェース分離の原則 (ISP)**
    - クライアントに必要なメソッドのみを公開
    - 例：型定義で必要最小限のプロパティのみ定義

5. **依存性逆転の原則 (DIP)**
    - 抽象に依存し、具象に依存しない
    - 例：`EventEmitter`を介した疎結合な通信

### 2.2 デザインパターン

#### State パターン（状態管理）

```typescript
// 状態クラスの基底
interface GameState {
    enter(scene: Phaser.Scene): void;
    update(scene: Phaser.Scene, delta: number): void;
    exit(scene: Phaser.Scene): void;
}

// 具体的な状態
class PlayingState implements GameState {
    enter(scene: Phaser.Scene): void {
        scene.events.emit("state:playing");
    }

    update(scene: Phaser.Scene, delta: number): void {
        // プレイ中のロジック
    }

    exit(scene: Phaser.Scene): void {
        // クリーンアップ
    }
}

// 状態マネージャー
class GameStateManager {
    private currentState: GameState | null = null;

    setState(scene: Phaser.Scene, newState: GameState): void {
        this.currentState?.exit(scene);
        this.currentState = newState;
        this.currentState.enter(scene);
    }

    update(scene: Phaser.Scene, delta: number): void {
        this.currentState?.update(scene, delta);
    }
}
```

**使用場面：**

- ゲーム全体の状態（メニュー、プレイ、一時停止、ゲームオーバー）
- キャラクターの状態（アイドル、移動、攻撃、死亡）
- UI の状態（開く、閉じる、アニメーション中）

#### Factory パターン（オブジェクト生成）

```typescript
// ファクトリークラス
class EnemyFactory {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    createEnemy(type: string, x: number, y: number): Enemy {
        switch (type) {
            case "basic":
                return new BasicEnemy(this.scene, x, y);
            case "fast":
                return new FastEnemy(this.scene, x, y);
            case "boss":
                return new BossEnemy(this.scene, x, y);
            default:
                throw new Error(`Unknown enemy type: ${type}`);
        }
    }

    createFromData(data: EnemySpawnData): Enemy {
        const enemy = this.createEnemy(data.type, data.x, data.y);
        enemy.setHealth(data.health);
        return enemy;
    }
}

// Scene内での使用
class GameScene extends Phaser.Scene {
    private enemyFactory?: EnemyFactory;

    create() {
        this.enemyFactory = new EnemyFactory(this);

        // シンプルな生成
        const enemy = this.enemyFactory.createEnemy("basic", 100, 100);
    }
}
```

**利点：**

- Scene内での `new` 呼び出しを最小化
- 生成ロジックの一元管理
- テストが容易

#### Observer パターン（イベント駆動）

```typescript
// イベントペイロードの型定義
interface ScoreEventPayload {
    score: number;
    multiplier: number;
    reason: string;
}

// イベント送信側
class ScoreSystem {
    private scene: Phaser.Scene;

    addScore(points: number, multiplier: number = 1): void {
        const totalScore = points * multiplier;

        // イベント発火
        this.scene.events.emit("score:added", {
            score: totalScore,
            multiplier,
            reason: "enemy_defeated",
        } as ScoreEventPayload);
    }
}

// イベント受信側
class UIManager {
    constructor(scene: Phaser.Scene) {
        // イベントリスナー登録
        scene.events.on("score:added", this.handleScoreAdded, this);
    }

    private handleScoreAdded(payload: ScoreEventPayload): void {
        // スコア表示を更新
        console.log(`+${payload.score} (x${payload.multiplier})`);
    }

    destroy(): void {
        // クリーンアップ
        this.scene.events.off("score:added", this.handleScoreAdded, this);
    }
}
```

**ベストプラクティス：**

- イベント名は定数化（`EVENTS.SCORE_ADDED`）
- ペイロードは型定義で明確化
- `destroy()`で必ずリスナー解除

### 2.3 Sceneの設計

#### Scene の責務

Scene は**軽量**に保ち、以下の役割のみを担当：

1. ライフサイクルの管理（`create`, `update`, `shutdown`）
2. マネージャーの初期化と保持
3. イベントのルーティング

```typescript
export class GameScene extends Phaser.Scene {
    // マネージャークラス（実装は委譲）
    private soundManager?: SoundManager;
    private inputManager?: InputManager;
    private gameLogicManager?: GameLogicManager;

    constructor() {
        super({ key: "GameScene" });
    }

    create() {
        // イベントリスナーのクリーンアップ（重複防止）
        this.cleanupEvents();

        // マネージャー初期化
        this.initializeManagers();

        // イベント連携設定
        this.setupEventIntegration();
    }

    update(time: number, delta: number) {
        // マネージャーに処理を委譲
        this.gameLogicManager?.update(time, delta);
    }

    shutdown() {
        // クリーンアップ
        this.cleanupEvents();
        this.soundManager?.destroy();
        this.inputManager?.destroy();
    }

    private cleanupEvents(): void {
        this.events.off("game:score");
        this.events.off("game:over");
    }

    private initializeManagers(): void {
        this.soundManager = new SoundManager(this);
        this.inputManager = new InputManager(this);
        this.gameLogicManager = new GameLogicManager(this);
    }

    private setupEventIntegration(): void {
        // イベント駆動で各マネージャーを連携
        this.events.on("game:score", this.handleScore, this);
    }

    private handleScore(payload: ScoreEventPayload): void {
        this.soundManager?.playSe("score");
    }
}
```

#### Scene 遷移の管理

```typescript
// シーン起動（並行実行）
this.scene.launch("UIScene");

// シーン切り替え（現在のシーンを停止）
this.scene.start("GameOverScene", { finalScore: 1000 });

// シーン一時停止
this.scene.pause("GameScene");
this.scene.resume("GameScene");

// データ渡し
this.scene.start("ResultScene", {
    score: this.currentScore,
    time: this.elapsedTime,
});
```

### 2.4 マネージャークラスの設計

#### マネージャーの責務

各マネージャーは特定のドメインに特化：

```typescript
// サウンドマネージャー（音声管理）
class SoundManager {
    private scene: Phaser.Scene;
    private currentBgm?: Phaser.Sound.BaseSound;

    playBgm(key: string, volume: number = 0.8): void {
        /* ... */
    }
    playSe(key: string, volume: number = 1.0): void {
        /* ... */
    }
    stopBgm(): void {
        /* ... */
    }
}

// 入力マネージャー（入力検出）
class InputManager {
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.setupSwipeDetection();
    }

    private setupSwipeDetection(): void {
        // スワイプ検出ロジック
        // イベント発火: this.scene.events.emit("input:swipe", data);
    }
}

// レイアウトマネージャー（画面分割管理）
class AreaLayoutManager {
    private static instance: AreaLayoutManager;

    static getInstance(): AreaLayoutManager {
        if (!this.instance) {
            this.instance = new AreaLayoutManager();
        }
        return this.instance;
    }

    getPuzzleArea(): { x: number; y: number; width: number; height: number } {
        // エリア情報を返す
    }
}
```

**シングルトンパターンの使用**

- グローバルな状態を持つマネージャーに適用
- 例：`AreaLayoutManager`, `SaveDataManager`

---

## 3. 開発フェーズ

### 3.1 フェーズ1: プロトタイピング（1-2週間）

#### 目標

- コアゲームループの実装
- 基本的な操作感の確認
- 技術的な実現可能性の検証

#### タスク

1. ミニマルなSceneの実装

    ```typescript
    class PrototypeScene extends Phaser.Scene {
        create() {
            // 最小限のゲームオブジェクト配置
            const player = this.add.sprite(100, 100, "player");

            // 基本操作の実装
            this.input.on("pointerdown", () => {
                console.log("Click detected");
            });
        }
    }
    ```

2. 基本アセットの仮配置
    - プレースホルダー画像（単色矩形など）
    - 必要最小限のサウンド

3. コアメカニクスのテスト
    - プレイヤー操作
    - 当たり判定
    - スコアリング

#### 成果物

- 動作する最小限のゲーム
- 技術的な課題リスト

### 3.2 フェーズ2: アーキテクチャ構築（2-3週間）

#### 目標

- 本番を見据えた設計への移行
- マネージャークラスの実装
- イベント駆動アーキテクチャの確立

#### タスク

1. ディレクトリ構造の整備
2. 定数ファイルの作成

    ```typescript
    // constants/Game.ts
    export const SCREEN = {
        WIDTH: 1200,
        HEIGHT: 800,
    } as const;

    export const DEPTH = {
        BACKGROUND: 0,
        GAME: 100,
        UI: 200,
        OVERLAY: 300,
    } as const;
    ```

3. マネージャークラスの実装
    - SoundManager
    - InputManager
    - StateManager

4. Factory クラスの実装

    ```typescript
    class TileFactory {
        createTile(type: TileType, x: number, y: number): Tile {
            // タイプに応じたタイル生成
        }
    }
    ```

5. イベント設計
    ```typescript
    // イベント名を定数化
    export const EVENTS = {
        SCORE_ADDED: "score:added",
        GAME_OVER: "game:over",
        LEVEL_UP: "level:up",
    } as const;
    ```

#### 成果物

- スケーラブルなアーキテクチャ
- 再利用可能なマネージャークラス
- イベント駆動の通信基盤

### 3.3 フェーズ3: コンテンツ実装（4-8週間）

#### 目標

- ゲームコンテンツの完全実装
- アセットの本番クオリティ化
- ユーザー体験の洗練

#### タスク

1. **ゲームシステムの完成**
    - ステージ/レベル設計
    - 敵AI実装
    - パワーアップシステム
    - プログレッション（進行度）

2. **UI/UX の実装**

    ```typescript
    class UIManager {
        private scoreText?: Phaser.GameObjects.Text;
        private healthBar?: Phaser.GameObjects.Graphics;

        createUI(scene: Phaser.Scene): void {
            this.scoreText = scene.add.text(10, 10, "Score: 0", {
                fontSize: "24px",
                color: "#ffffff",
            });
        }

        updateScore(score: number): void {
            if (this.scoreText) {
                this.scoreText.setText(`Score: ${score}`);
            }
        }
    }
    ```

3. **エフェクトとアニメーション**

    ```typescript
    // パーティクルエフェクト
    const particles = this.add.particles("particle");
    const emitter = particles.createEmitter({
        speed: { min: -100, max: 100 },
        scale: { start: 1, end: 0 },
        lifespan: 1000,
    });

    // Tweenアニメーション
    this.tweens.add({
        targets: sprite,
        x: 400,
        y: 300,
        scale: 1.5,
        duration: 1000,
        ease: "Power2",
    });
    ```

4. **サウンド実装**
    - BGM のループ再生
    - SE のタイミング調整
    - 音量バランス調整

5. **チュートリアルシステム**
    ```typescript
    class TutorialManager {
        private currentStep: number = 0;

        showStep(stepId: string): void {
            // チュートリアル表示
        }

        completeStep(): void {
            this.currentStep++;
            this.saveProgress();
        }
    }
    ```

#### 成果物

- フルゲームコンテンツ
- 完成したUI/UX
- チュートリアルシステム

### 3.4 フェーズ4: 最適化とデバッグ（2-4週間）

#### 目標

- パフォーマンス最適化
- バグ修正
- クロスブラウザ対応

#### タスク

1. **パフォーマンス測定**

    ```typescript
    // FPS監視
    const fpsText = this.add.text(10, 10, "", { fontSize: "16px" });
    this.game.events.on("step", () => {
        fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
    });
    ```

2. **最適化ポイント**
    - テクスチャアトラスの使用
    - オブジェクトプールの実装
    - 不要なオブジェクトの破棄
    - 描画レイヤーの最適化

3. **デバッグツールの実装**

    ```typescript
    // デバッグモード
    if (import.meta.env.DEV) {
        // 当たり判定の可視化
        this.physics.world.createDebugGraphic();

        // デバッグコマンド
        (window as any).debugSkipLevel = () => {
            this.scene.start("NextLevel");
        };
    }
    ```

4. **エラーハンドリング**
    ```typescript
    try {
        // リスキーな処理
        this.loadGameData();
    } catch (error) {
        console.error("[GameScene] Failed to load data:", error);
        // フォールバック処理
        this.loadDefaultData();
    }
    ```

#### 成果物

- 最適化されたゲーム
- デバッグログ
- エラーハンドリング

---

## 4. 実装パターン

### 4.1 Entity-Component 的なアプローチ

Phaser 3では純粋なECSではないが、類似のアプローチを取ることができます。

```typescript
// 基底エンティティ
class Entity extends Phaser.GameObjects.Container {
    protected health: number = 100;
    protected speed: number = 100;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
        scene.add.existing(this);
    }

    takeDamage(amount: number): void {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die(): void {
        this.emit("death");
        this.destroy();
    }

    update(delta: number): void {
        // オーバーライド可能
    }
}

// プレイヤーエンティティ
class Player extends Entity {
    private sprite: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.sprite = scene.add.sprite(0, 0, "player");
        this.add(this.sprite);

        this.setupInputHandlers();
    }

    private setupInputHandlers(): void {
        this.scene.input.keyboard?.on("keydown-SPACE", () => {
            this.jump();
        });
    }

    jump(): void {
        this.emit("player:jump");
    }
}
```

### 4.2 データ駆動設計

設定データを外部化し、コードとデータを分離します。

```typescript
// データ定義
interface EnemyData {
    type: string;
    health: number;
    speed: number;
    damage: number;
    spriteKey: string;
}

// データファイル（JSON or TypeScript）
export const ENEMY_DATA: Record<string, EnemyData> = {
    goblin: {
        type: "goblin",
        health: 50,
        speed: 80,
        damage: 10,
        spriteKey: "enemy_goblin",
    },
    dragon: {
        type: "dragon",
        health: 500,
        speed: 60,
        damage: 50,
        spriteKey: "enemy_dragon",
    },
};

// 使用例
class Enemy extends Entity {
    constructor(scene: Phaser.Scene, enemyType: string, x: number, y: number) {
        super(scene, x, y);

        const data = ENEMY_DATA[enemyType];
        if (!data) {
            throw new Error(`Unknown enemy type: ${enemyType}`);
        }

        this.health = data.health;
        this.speed = data.speed;
        this.sprite = scene.add.sprite(0, 0, data.spriteKey);
    }
}
```

### 4.3 オブジェクトプール

頻繁に生成・破棄されるオブジェクトはプールで管理します。

```typescript
class BulletPool {
    private pool: Bullet[] = [];
    private scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, initialSize: number = 20) {
        this.scene = scene;

        // プールを事前に生成
        for (let i = 0; i < initialSize; i++) {
            const bullet = new Bullet(scene, 0, 0);
            bullet.setActive(false);
            bullet.setVisible(false);
            this.pool.push(bullet);
        }
    }

    spawn(x: number, y: number, velocityX: number, velocityY: number): Bullet {
        // 非アクティブな弾を探す
        let bullet = this.pool.find((b) => !b.active);

        // プールに空きがなければ新規作成
        if (!bullet) {
            bullet = new Bullet(this.scene, x, y);
            this.pool.push(bullet);
        }

        // 再利用
        bullet.setPosition(x, y);
        bullet.setVelocity(velocityX, velocityY);
        bullet.setActive(true);
        bullet.setVisible(true);

        return bullet;
    }

    despawn(bullet: Bullet): void {
        bullet.setActive(false);
        bullet.setVisible(false);
    }
}
```

### 4.4 セーブ/ロードシステム

```typescript
interface SaveData {
    version: string;
    playerData: {
        level: number;
        experience: number;
        gold: number;
    };
    gameProgress: {
        unlockedLevels: string[];
        completedQuests: string[];
    };
    settings: {
        bgmVolume: number;
        seVolume: number;
    };
}

class SaveDataManager {
    private static instance: SaveDataManager;
    private readonly SAVE_KEY = "myGame_saveData";
    private readonly SAVE_VERSION = "1.0.0";

    static getInstance(): SaveDataManager {
        if (!this.instance) {
            this.instance = new SaveDataManager();
        }
        return this.instance;
    }

    save(data: SaveData): void {
        try {
            const saveData = {
                ...data,
                version: this.SAVE_VERSION,
                timestamp: Date.now(),
            };
            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            console.log("[SaveDataManager] Data saved successfully");
        } catch (error) {
            console.error("[SaveDataManager] Failed to save data:", error);
        }
    }

    load(): SaveData | null {
        try {
            const dataString = localStorage.getItem(this.SAVE_KEY);
            if (!dataString) return null;

            const data = JSON.parse(dataString) as SaveData;

            // バージョンチェック
            if (data.version !== this.SAVE_VERSION) {
                console.warn("[SaveDataManager] Save data version mismatch");
                return this.migrate(data);
            }

            return data;
        } catch (error) {
            console.error("[SaveDataManager] Failed to load data:", error);
            return null;
        }
    }

    private migrate(oldData: any): SaveData {
        // バージョン間のデータ移行処理
        console.log("[SaveDataManager] Migrating save data...");
        return oldData; // 実際には変換ロジックを実装
    }

    reset(): void {
        localStorage.removeItem(this.SAVE_KEY);
        console.log("[SaveDataManager] Save data reset");
    }
}
```

---

## 5. 最適化とデバッグ

### 5.1 パフォーマンス最適化

#### テクスチャアトラスの使用

```typescript
// PreloadScene.ts
class PreloadScene extends Phaser.Scene {
    preload() {
        // 複数の画像を1つのアトラスにまとめる
        this.load.atlas(
            "game_atlas",
            "assets/atlas/game_atlas.png",
            "assets/atlas/game_atlas.json",
        );
    }
}

// 使用時
this.add.sprite(100, 100, "game_atlas", "player_idle");
```

#### 描画レイヤーの最適化

```typescript
// 深度（Z-index）を適切に設定
export const DEPTH = {
    BACKGROUND: 0,
    TERRAIN: 50,
    OBJECTS: 100,
    CHARACTERS: 200,
    EFFECTS: 300,
    UI: 1000,
    OVERLAY: 2000,
} as const;

// 使用例
this.sprite.setDepth(DEPTH.CHARACTERS);
```

#### 不要なオブジェクトの破棄

```typescript
class GameScene extends Phaser.Scene {
    shutdown() {
        // シーン終了時にクリーンアップ
        this.children.removeAll(true); // すべての子を破棄
        this.events.off(); // すべてのイベントリスナーを解除

        // マネージャーのクリーンアップ
        this.soundManager?.destroy();
        this.inputManager?.destroy();
    }
}
```

### 5.2 デバッグ戦略

#### コンテキスト付きログ

```typescript
class GameScene extends Phaser.Scene {
    private log(message: string, ...args: any[]): void {
        console.log(`[GameScene] ${message}`, ...args);
    }

    create() {
        this.log("Scene created");
        this.log("Player position:", { x: this.player.x, y: this.player.y });
    }
}
```

#### デバッグモードの実装

```typescript
// constants/Game.ts
export const DEBUG = {
    ENABLED: import.meta.env.DEV,
    SHOW_FPS: true,
    SHOW_HITBOXES: true,
    GOD_MODE: false,
} as const;

// 使用例
if (DEBUG.ENABLED && DEBUG.SHOW_HITBOXES) {
    this.physics.world.createDebugGraphic();
}
```

#### ブラウザコンソールからの操作

```typescript
class GameScene extends Phaser.Scene {
    create() {
        if (import.meta.env.DEV) {
            this.setupDebugCommands();
        }
    }

    private setupDebugCommands(): void {
        (window as any).game = {
            skipLevel: () => this.scene.start("NextLevel"),
            addScore: (amount: number) => this.addScore(amount),
            setHealth: (amount: number) => this.player.setHealth(amount),
            resetSave: () => SaveDataManager.getInstance().reset(),
        };

        console.log(
            "[Debug] Commands available:",
            Object.keys((window as any).game),
        );
    }
}
```

---

## 6. ビルドとデプロイ

### 6.1 ブラウザ版ビルド

#### ビルドコマンド

```bash
# 本番ビルド
npm run build

# プレビュー
npm run preview
```

#### vite.config.ts（本番設定）

```typescript
import { defineConfig } from "vite";

export default defineConfig({
    base: "./", // 相対パスでビルド
    build: {
        target: "esnext",
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: true, // console.logを削除
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ["phaser"],
                },
            },
        },
    },
});
```

#### デプロイ先

- **Netlify**: `npm run build` → `dist/` をデプロイ
- **Vercel**: 自動ビルド・デプロイ
- **GitHub Pages**: GitHub Actions で自動デプロイ
- **itch.io**: ZIPでアップロード

### 6.2 Electron版ビルド（パッケージ版）

#### electron-builder設定

```json
// package.json
{
    "build": {
        "appId": "com.mycompany.mygame",
        "productName": "My Awesome Game",
        "directories": {
            "output": "build/desktop"
        },
        "files": ["dist/**/*", "dist-electron/**/*"],
        "win": {
            "target": ["nsis"],
            "icon": "public/icon.ico"
        },
        "mac": {
            "target": ["dmg"],
            "icon": "public/icon.icns"
        },
        "linux": {
            "target": ["AppImage"],
            "icon": "public/icon.png"
        }
    }
}
```

#### ビルドスクリプト

```bash
# Windows版ビルド
npm run build:win

# Mac版ビルド
npm run build:mac

# Linux版ビルド
npm run build:linux
```

### 6.3 環境変数とビルド分岐

#### 環境変数設定

```typescript
// vite-env.d.ts
/// <reference types="vite/client" />

declare const __VITE_MODE__: "browser" | "desktop";

interface ImportMetaEnv {
    readonly VITE_MODE: string;
}
```

#### ビルド分岐

```typescript
// main.ts
if (typeof __VITE_MODE__ !== "undefined" && __VITE_MODE__ === "desktop") {
    console.log("Running in desktop mode");
    // Electron固有の初期化
} else {
    console.log("Running in browser mode");
    // ブラウザ固有の初期化
}
```

#### 購入促進シーンの分岐（体験版）

```typescript
class GameScene extends Phaser.Scene {
    private showPurchasePromotionIfBrowser(): void {
        if (
            typeof __VITE_MODE__ !== "undefined" &&
            __VITE_MODE__ === "browser"
        ) {
            // ブラウザ版のみ表示
            this.scene.launch("PurchasePromotionScene");
        }
    }
}
```

---

## 7. 保守とアップデート

### 7.1 バージョン管理戦略

#### セマンティックバージョニング

```
v1.0.0: 初回リリース
v1.0.1: バグ修正
v1.1.0: 新機能追加（後方互換）
v2.0.0: 大規模リニューアル（破壊的変更）
```

#### バージョン情報の埋め込み

```typescript
// constants/Version.ts
export const VERSION = "1.0.0" as const;
export const BUILD_DATE = "2026-02-12" as const;

// タイトル画面に表示
this.add.text(10, 10, `v${VERSION}`, {
    fontSize: "12px",
    color: "#888888",
});
```

### 7.2 セーブデータの互換性

```typescript
class SaveDataManager {
    private readonly SAVE_VERSION = "2.0.0";

    private migrate(oldData: any): SaveData {
        const oldVersion = oldData.version || "1.0.0";

        console.log(
            `[SaveDataManager] Migrating from v${oldVersion} to v${this.SAVE_VERSION}`,
        );

        // バージョンごとの移行処理
        if (oldVersion === "1.0.0") {
            oldData = this.migrateFrom1_0_0(oldData);
        }

        return oldData;
    }

    private migrateFrom1_0_0(data: any): any {
        // v1.0.0 → v2.0.0 の変換
        return {
            ...data,
            version: "2.0.0",
            newFeatureData: {}, // 新機能用のデータを追加
        };
    }
}
```

### 7.3 アップデートの計画

#### リリースサイクル

1. **パッチリリース（週次）**: バグ修正、軽微な改善
2. **マイナーリリース（月次）**: 新機能追加、コンテンツ追加
3. **メジャーリリース（数ヶ月～年次）**: 大規模リニューアル

#### チェンジログの管理

```markdown
# CHANGELOG.md

## [1.1.0] - 2026-03-01

### Added

- 新ステージ追加（ステージ10-15）
- 新キャラクター「エルフ」追加

### Changed

- 敵の難易度を調整
- UI のアニメーションを改善

### Fixed

- セーブデータが消える不具合を修正
- BGM が途切れる不具合を修正
```

---

## 8. チェックリスト

### リリース前チェックリスト

#### ブラウザ版

- [ ] 主要ブラウザでの動作確認（Chrome, Firefox, Safari, Edge）
- [ ] モバイルブラウザでの動作確認
- [ ] ページ読み込み時間の確認（3秒以内）
- [ ] console.error がないことを確認
- [ ] アセットの最適化（画像圧縮、音声圧縮）
- [ ] メタタグ設定（OGP、favicon）
- [ ] アナリティクス設定（Google Analytics等）

#### パッケージ版（Electron）

- [ ] Windows, Mac, Linux での動作確認
- [ ] インストーラーの動作確認
- [ ] アンインストール時のクリーンアップ確認
- [ ] 自動アップデート機能の確認
- [ ] セーブデータの保存場所確認
- [ ] アプリアイコンの表示確認

#### 共通

- [ ] すべての機能が正常に動作
- [ ] 致命的なバグがない
- [ ] チュートリアルがわかりやすい
- [ ] ゲームバランスが適切
- [ ] サウンドのバランスが適切
- [ ] テキストの誤字脱字がない
- [ ] クレジット表記が正しい
- [ ] ライセンス確認（使用素材、ライブラリ）

---

## 9. 参考リソース

### 公式ドキュメント

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 Examples](https://phaser.io/examples)
- [Phaser 3 Tutorials](https://phaser.io/tutorials)

### コミュニティ

- [Phaser Discourse Forum](https://phaser.discourse.group/)
- [Discord](https://discord.gg/phaser)
- [GitHub](https://github.com/photonstorm/phaser)

### ツール

- [Texture Packer](https://www.codeandweb.com/texturepacker) - アトラス生成
- [Tiled](https://www.mapeditor.org/) - タイルマップエディタ
- [Aseprite](https://www.aseprite.org/) - ピクセルアートエディタ

---

## 10. おわりに

本ガイドは、Phaser 3を使用した本格的なゲーム開発における実践的なワークフローと設計パターンをまとめたものです。

**重要なポイント:**

1. **アーキテクチャを最初に設計**：後からのリファクタリングはコストが高い
2. **SOLID原則とデザインパターンの活用**：保守性の高いコードベース
3. **イベント駆動設計**：疎結合で拡張性の高いシステム
4. **Scene の軽量化**：マネージャークラスへの責務の委譲
5. **テストとデバッグの重視**：品質の高いゲーム体験

これらの原則を守ることで、スケーラブルで保守性の高いゲーム開発が可能になります。

**次のステップ:**

- 小規模なゲームでパターンを試す
- 実際のプロジェクトに適用する
- チームでコーディング規約を共有する

Happy Game Development! 🎮

# 体験版とパッケージ版の分離機能

## 概要

このドキュメントでは、AICreatorにおける体験版（デモ版）とパッケージ版（フル版）の分離機能について説明します。

## 機能概要

### 1. バージョン管理システム

**VersionManager**クラスが、アプリケーションのバージョンと実行環境を自動判定します。

#### バージョン判定ロジック

1. **Electron環境**の場合 → 自動的に**パッケージ版**として扱う
2. 環境変数`VITE_APP_VERSION`が`"package"`に設定されている場合 → **パッケージ版**
3. それ以外 → **体験版**（デモ版）

#### 使用例

```typescript
import { VersionManager } from "./core/managers/VersionManager";

const versionManager = VersionManager.getInstance();

if (versionManager.isPackageVersion()) {
    // パッケージ版専用の処理
    console.log("Package version features enabled");
}

if (versionManager.isDemoVersion()) {
    // 体験版専用の処理
    console.log("Demo version - limited features");
}
```

### 2. 動的アセットロード

**PreloadScene**が、バージョンに応じて異なるアセットを読み込みます。

#### 共通アセット
- AIコア画像
- 基本モジュール画像
- ゲーム出力画像
- リソース画像
- パイプラインスプライトシート
- 基本BGM/SE

#### パッケージ版専用アセット
- ギャラリーアイコン
- ランキングアイコン
- ギャラリー背景画像
- （今後追加される専用BGM/SEなど）

### 3. ローカルランキング機能（パッケージ版専用）

Electron Storeを使用して、ローカルにスコアランキングを保存します。

#### 機能詳細

- **データ保存**: スコア、日時、プレイヤー名（オプション）
- **保存件数**: 上位10件まで自動管理
- **自動ソート**: スコアの降順で自動ソート
- **永続化**: Electronのユーザーデータフォルダに保存

#### LocalRankingManagerの使用例

```typescript
import { LocalRankingManager } from "./core/managers/LocalRankingManager";

const rankingManager = LocalRankingManager.getInstance();

// ランキングが利用可能かチェック
if (rankingManager.isAvailable()) {
    // スコアを追加
    await rankingManager.addScore(12345, "Player1");
    
    // トップ10を取得
    const top10 = rankingManager.getTop10();
    
    // ランクイン判定
    const isRanked = rankingManager.isRankingScore(10000);
}
```

#### RankingSceneの機能

- トップ10ランキングの表示
- ランク別の色分け表示（ゴールド/シルバー/ブロンズ）
- 記録日時の表示
- タイトル画面への戻るボタン

#### GameOverSceneとの連携

ゲームオーバー時、パッケージ版では自動的にスコアがランキングに保存されます。
ランクインした場合は、特別な通知が表示されます。

### 4. ギャラリー機能（パッケージ版専用）

BGM、効果音、アセット画像を閲覧・再生できるギャラリー機能を提供します。

#### 機能詳細

**3つのタブ構成**:
1. **BGMタブ**: ゲーム内のBGMを試聴
2. **Sound Effectsタブ**: 効果音を再生
3. **Assetsタブ**: ゲーム内のアセット画像を閲覧

#### GallerySceneの使用方法

タイトル画面の「GALLERY」ボタンから起動します。

**各アセットには以下の情報が表示されます**:
- アセット名
- 説明文
- 再生ボタン（BGM/SE）または画像サムネイル

### 5. タイトル画面のバージョン別表示

**体験版の場合**:
- START GAMEボタンのみ
- 画面右下に「Demo Version」表記

**パッケージ版の場合**:
- START GAMEボタン
- RANKINGボタン（ローカルランキング表示）
- GALLERYボタン（ギャラリー画面表示）
- 画面右下に「Package Version」表記

## 設定方法

### 環境変数の設定

`.env`ファイルを作成し、以下の環境変数を設定します。

```bash
# 体験版として実行（デフォルト）
VITE_APP_VERSION=demo

# パッケージ版として実行（ブラウザ環境で強制的にパッケージ版機能を有効化）
VITE_APP_VERSION=package
```

**注意**: Electron環境では、環境変数に関わらず自動的にパッケージ版として扱われます。

### ビルド方法

#### ブラウザ版（体験版）のビルド
```bash
npm run build
```

#### Electronアプリ（パッケージ版）のビルド
```bash
npm run build:desktop
```

## アーキテクチャ設計

### デザインパターン

#### 1. Singletonパターン
- **VersionManager**: アプリケーション全体で単一のインスタンスを使用
- **LocalRankingManager**: ランキングデータの一貫性を保証

#### 2. Factoryパターン
- **PreloadScene**: バージョンに応じた適切なアセットロードを生成

#### 3. Observerパターン
- Phaserの`EventEmitter`を活用したシーン間通信

### 関心の分離

各クラスは明確な責任を持ちます:

- **VersionManager**: バージョン判定のみ
- **LocalRankingManager**: ランキングデータ管理のみ
- **PreloadScene**: アセットロードのみ
- **RankingScene**: ランキング表示のみ
- **GalleryScene**: ギャラリー表示のみ

### 拡張性

新しいパッケージ版専用機能を追加する場合:

1. **VersionManager**でバージョンチェック
2. 必要に応じて**PreloadScene**でアセット追加
3. 新しいシーンやマネージャーを作成
4. **TitleScene**にボタン追加（条件付き）

## トラブルシューティング

### ランキングが保存されない

**原因**: Electron環境でない、または`electron-store`が正しくインストールされていない

**解決策**:
1. `npm install electron-store`を実行
2. Electronアプリとして起動していることを確認
3. コンソールログで`[LocalRankingManager]`のメッセージを確認

### パッケージ版機能が表示されない

**原因**: バージョン判定が正しく動作していない

**解決策**:
1. `VersionManager.getInstance().getAppVersion()`で現在のバージョンを確認
2. Electronアプリとして起動しているか確認
3. `.env`ファイルの`VITE_APP_VERSION`設定を確認

### ギャラリーで音声が再生されない

**原因**: アセットが正しくロードされていない

**解決策**:
1. PreloadSceneでアセットが正常にロードされたか確認
2. コンソールログでエラーメッセージを確認
3. `assets/sound/`ディレクトリに該当ファイルが存在するか確認

## 今後の拡張案

### 追加機能候補

1. **プレイヤー名入力機能**
   - ランキングにプレイヤー名を登録

2. **実績システム**
   - 特定条件達成で実績解除
   - ギャラリーで確認可能

3. **オンラインランキング連携**
   - ローカルランキングとは別にオンラインランキングを実装

4. **カスタムBGM/SE**
   - ユーザーが独自の音楽ファイルを追加

5. **スキン/テーマシステム**
   - パッケージ版限定で複数のUIテーマを提供

## まとめ

この機能により、体験版とパッケージ版で異なる価値を提供できるようになりました。

**体験版**: 基本的なゲーム体験を提供し、ゲームの魅力を伝える
**パッケージ版**: ランキング、ギャラリーなど追加機能で長期的なエンゲージメントを提供

設計は拡張性を重視しており、今後の機能追加が容易になっています。

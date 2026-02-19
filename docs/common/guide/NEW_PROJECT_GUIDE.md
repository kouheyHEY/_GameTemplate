# 新規プロジェクト開始ガイド (New Project Guide)

このテンプレートを使用して、新しいゲームプロジェクトを開始するための手順とルールを説明します。人間および AI アシスタント（Gemini CLI）はこの手順に従って環境を構築してください。

## 1. プロジェクトの初期化

### 1.1 ディレクトリの準備
1.  このテンプレートディレクトリを丸ごと新しいプロジェクト名でコピーします。
2.  コピー先のディレクトリに移動し、既存の Git 履歴を削除して初期化します。

```powershell
# Git の初期化（既存の履歴を破棄して新しく開始する場合）
Remove-Item -Recurse -Force .git
git init
```

### 1.2 基本情報の更新
1.  `package.json`: `name`, `version`, `description` を新しいゲームに合わせて書き換えます。
2.  `README.md`: テンプレートの説明を削除し、ゲームの概要、遊び方、ビルド方法を記述します。

## 2. 共通ドキュメント (Git Subtree) の設定

このプロジェクトの `docs/` は外部リポジトリ（共通ドキュメント基盤）と同期可能です。新しいプロジェクトでも最新のガイドラインを利用できるように設定します。

### 2.1 リモートの登録と同期
```powershell
# 共通ドキュメントリポジトリを "docs-origin" として登録
git remote add docs-origin <共通ドキュメントリポジトリのURL>

# Subtree として紐付け（既存の docs フォルダと同期を確立）
git subtree add --prefix=docs docs-origin main --squash
```

### 2.2 日常の同期コマンド
- **最新のガイドを取り込む**: `git subtree pull --prefix=docs docs-origin main --squash`
- **共通ガイドを改善して共有する**: `git subtree push --prefix=docs docs-origin main`

## 3. 開発のルールと責務の分離

保守性を高めるため、以下の分離ルールを厳守してください。

### 3.1 共通資産 (Core / Common / Game-Logic-Guide)
- **`src/core/`**: フレームワークの基盤。特定のゲームに依存するコードは書かないでください。改善した場合は、テンプレート側へも反映を検討してください。
- **`docs/common/`**: 全プロジェクトで共通の運用ルールやテンプレート。
- **`docs/game/guide/`**: Phaser 3 やゲーム開発全般の知見・設計パターン。

### 3.2 個別資産 (App / Game-Specific)
- **`src/game/`**: そのゲーム固有のシーン、オブジェクト、ロジック。
- **`docs/app/history/`**: このゲームの開発履歴（要件、設計判断、大規模実装）。**新規開始時は中身を空にしてから開始してください。**
- **`docs/app/guide/`**: このゲーム固有の仕様書やマニュアル。

## 4. AI (Gemini CLI) への指示

新しいプロジェクトで Gemini CLI を使用する際は、最初に以下のコンテキストを伝えてください。

> 「このプロジェクトは Phaser 3 / Electron テンプレートをベースにしています。`src/core` は共通基盤であり、ゲーム固有のロジックは `src/game` に実装します。変更履歴は `docs/app/history/` に記録し、共通の規約については `docs/common/guide/` を参照してください。」

## 5. チェックリスト
- [ ] `.git` を初期化し、新しいリポジトリとして構成したか
- [ ] `package.json` の情報を更新したか
- [ ] `docs-origin` を登録し、Subtree の同期を確認したか
- [ ] `docs/app/history/` 内の古い履歴（テンプレートの履歴）を削除したか

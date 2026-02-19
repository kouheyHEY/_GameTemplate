# GEMINI.md

このファイルは、Gemini CLI がこのプロジェクトを理解し、効率的に開発を支援するためのコンテキストを提供します。

## プロジェクト概要
Phaser 3、TypeScript、Vite、Electron をベースとした汎用的なゲーム開発テンプレートです。ポータブルなコアフレームワーク (`src/core`) と、具体的なゲーム実装 (`src/game`) が分離されたクリーンなアーキテクチャを採用しています。

### 主な技術スタック
- **ゲームエンジン**: Phaser 3 (v3.80.0+)
- **言語**: TypeScript
- **ビルドツール**: Vite
- **デスクトップ実行環境**: Electron
- **状態管理**: 独自の StateMachine 実装
- **デザインパターン**: Service Locator, BaseScene 継承, State パターン

### ディレクトリ構造
- `src/core`: フレームワークのコアロジック（ベースクラス、共通サービス、ユーティリティ）。原則として変更せず、再利用性を維持します。
- `src/game`: ゲーム固有のロジック（シーン、オブジェクト、マネージャー）。
- `src/config`: ゲーム全体のコンフィギュレーション。
- `docs/`: 開発ガイド、履歴、テンプレートなどのドキュメント。
    - `docs/common/`: 全プロジェクト共通のドキュメント（ガイド・テンプレート）。
    - `docs/game/`: ゲーム開発に特化したドキュメント。
    - `docs/app/`: プロジェクト固有のドキュメント（履歴・ガイド）。
- `electron/`: Electron メインプロセスおよびプリロードスクリプト。

## 開発コマンド

### 開発用
- `npm run dev`: Webブラウザでの開発用サーバー起動。
- `npm run dev:desktop`: Electron環境での開発モード起動。

### ビルド・確認
- `npm run build`: Web用ビルド。
- `npm run build:desktop`: デスクトップ用ビルド (electron-builder)。
- `npm run build:desktop:win`: Windows向けビルド。
- `npm run preview`: ビルド済み成果物のプレビュー。

## 開発規約

### 共通原則
- **言語**: 会話、コードコメント、ドキュメント、およびコミットメッセージ等はすべて**日本語**を使用します。
- **デバッグログ**: `console.log("[ClassName:MethodName] message", data);` の形式を推奨します。
- **マジックナンバー**: 座標や設定値は `src/core/consts/` や各ファイル上部の定数に集約してください。

### アーキテクチャ
- **ServiceLocator**: グローバルサービス（`SoundManager` 等）へのアクセスには `ServiceLocator.get<T>('ServiceName')` を使用します。
- **BaseScene**: すべてのシーンは `BaseScene` を継承し、共通のライフサイクルや `inputManager` を利用します。
- **関心の分離**: シーンは表示とライフサイクル管理に徹し、ロジックは Manager や Service クラスに委ねます。

### 変更履歴の記録
重大な変更（要件定義、設計変更、大規模な実装）を行った際は、必ず `docs/app/history/` に履歴を記録してください。
- **ファイル名**: `YYYY-MM-DD_NN_変更内容の簡潔な説明.md`
- **詳細**: `docs/common/guide/HISTORY_GUIDE.md` のテンプレートに従ってください。

## 重要なファイル
- `src/main.ts`: エントリーポイント。サービスの登録とゲームの初期化を行います。
- `src/config/GameConfig.ts`: 画面サイズ、物理エンジン、スケーリング等の設定。
- `src/core/BaseScene.ts`: 全シーンの基底クラス。
- `src/core/ServiceLocator.ts`: 依存性注入のためのサービス管理。

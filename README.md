# Generic Game Template

This is a clean, reusable Phaser 3 game template designed for rapid development.
It includes a portable core framework (`src/core`) and a sample game implementation (`src/game`).

## Structure

- `src/core`: **Do not modify** (ideally). Contains reusable base classes, services, and utilities.
- `src/game`: **Your game logic**. Scenes, Objects, Managers specific to your game.
- `src/config`: Game configuration.

## Getting Started

1.  Copy this folder and rename it to your new project name.
2.  Run `npm install`.
3.  Run `npm run dev` to start the development server.

## Architecture

- **ServiceLocator**: Use `ServiceLocator.get('ServiceName')` to access global services.
- **BaseScene**: All scenes should extend `BaseScene`.
- **StateMachine**: Use `src/core/state/StateMachine` for complex entity logic.

## Documentation

- `docs/common/`: 共通ドキュメント（ガイド・テンプレート）。
    - [NEW_PROJECT_GUIDE.md](docs/common/guide/NEW_PROJECT_GUIDE.md): **[必読] 新規プロジェクト開始ガイド。**
    - [HISTORY_GUIDE.md](docs/common/guide/HISTORY_GUIDE.md): 変更履歴の記録方法。
    - `template/`: 各種設計・報告用テンプレート。
- `docs/game/`: ゲーム開発特有のドキュメント。
    - [BEGINNER_GUIDE.md](docs/game/guide/BEGINNER_GUIDE.md): 初心者向けガイド。
    - [ADVANCED_GUIDE.md](docs/game/guide/ADVANCED_GUIDE.md): 上級者向けガイド。
- `docs/app/`: プロジェクト固有のドキュメント。
    - `history/`: プロジェクトの変更履歴（要件、設計、実装）。
    - `guide/`: アプリケーション固有のガイド（任意）。

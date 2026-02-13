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

- `docs/guide/`: Development guides for beginners and advanced users.
    - [BEGINNER_GUIDE.md](docs/guide/BEGINNER_GUIDE.md): Step-by-step guide for your first game.
    - [ADVANCED_GUIDE.md](docs/guide/ADVANCED_GUIDE.md): Advanced patterns and best practices.
    - [HISTORY_GUIDE.md](docs/guide/HISTORY_GUIDE.md): Guidelines for recording project changes.
- `docs/history/`: Project change history (requirements, design, major implementations).
- `docs/template/`: Templates for documentation and postmortems.

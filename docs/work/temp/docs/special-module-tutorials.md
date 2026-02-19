# Special Module Tutorial Implementation

## Overview
This document describes the tutorial system for special modules and bug modules that appear in the game.

## Features

### Tutorial Types
The system tracks and displays tutorials for the following module types:

1. **Bug Module** - Appears when a bug module drops for the first time
2. **Cross Boost Module** - Appears when a cross boost tile is created (4-match)
3. **Super Bomber Module** - Appears when a super bomber tile is created (5+-match)
4. **Special Combo** - Appears when two special modules are matched together

### Tutorial Content

Each tutorial provides a one-step explanation:

- **Bug Module**: "バグモジュールが出現しました！バグモジュールは低確率で降ってきて、通常のマッチでは消せません。特殊モジュール（クロスブースト）で消去する必要があります。"

- **Cross Boost**: "クロスブーストモジュールが生成されました！4個つなげると生成される特殊モジュールです。起点から縦横一直線のモジュールを消し、バグモジュールをすべて消去します。"

- **Super Bomber**: "スーパーボンバーモジュールが生成されました！5個以上つなげると生成される特殊モジュールです。入れ替えたモジュールと同種のモジュールをすべて消します。"

- **Special Combo**: "特殊モジュール同士を組み合わせました！特殊モジュール同士でマッチするとより強力な効果が得られます。いろいろな組み合わせを試してみましょう。"

### Sequential Display
When multiple special modules appear simultaneously for the first time, tutorials are queued and displayed one at a time in order, with a 300ms delay between each.

## Architecture

### Components

1. **TutorialStateManager** (`src/core/managers/TutorialStateManager.ts`)
   - Singleton class that tracks which tutorials have been shown
   - Uses localStorage to persist tutorial state across sessions
   - Key: `aiCreator_tutorialState`

2. **SpecialModuleTutorialQueue** (`src/core/managers/SpecialModuleTutorialQueue.ts`)
   - Manages the queue of tutorials to display
   - Ensures tutorials are shown one at a time
   - Automatically processes the next tutorial after completion

3. **Tutorial Content** (`src/core/content/SpecialModuleTutorials.ts`)
   - Defines the tutorial steps for each module type
   - Uses the existing TutorialStep interface

4. **PuzzleManager Integration** (`src/core/managers/PuzzleManager.ts`)
   - Triggers tutorials when special tiles are created
   - Detects bug tiles when they spawn
   - Detects special tile combos

## Usage

### For Developers

The tutorial system is automatically integrated into the game. No manual intervention is needed.

### Triggering Tutorials

Tutorials are triggered automatically:
- **Bug Module**: When `BugTile` is created in `dropAndRefillTiles()`
- **Cross Boost**: When `CrossBoostTile` is created in `clearMatches()`
- **Super Bomber**: When `SuperBomberTile` is created in `clearMatches()`
- **Special Combo**: When two `SpecialTile` instances are swapped in `activateSpecialTile()`

### Testing Tutorials

To test tutorials during development:

```typescript
// Reset all tutorials (in browser console)
TutorialStateManager.getInstance().resetAll();

// Check tutorial state
TutorialStateManager.getInstance().getData();

// Manually trigger a specific tutorial (for testing)
specialModuleTutorialQueue.enqueue(TutorialType.BUG_MODULE);
```

## Implementation Details

### State Persistence
Tutorial state is stored in localStorage as:
```json
{
  "shown": {
    "bug_module": false,
    "cross_boost": false,
    "super_bomber": false,
    "special_combo": false
  }
}
```

### Event Flow
1. Special tile/bug is created in PuzzleManager
2. PuzzleManager calls `tutorialQueue.enqueue(type)`
3. TutorialQueue checks if tutorial has been shown before
4. If not shown, adds to queue and starts display if not already showing
5. TutorialManager displays the tutorial
6. On completion, TutorialQueue processes next tutorial in queue
7. Tutorial state is saved to localStorage

## Testing Checklist

- [ ] Bug module tutorial appears when first bug drops
- [ ] Cross Boost tutorial appears when first 4-match creates cross boost
- [ ] Super Bomber tutorial appears when first 5+-match creates super bomber
- [ ] Special Combo tutorial appears when first two special modules are matched
- [ ] Multiple tutorials display sequentially when multiple types appear at once
- [ ] Tutorials don't repeat after being shown once
- [ ] Tutorial state persists across page refreshes
- [ ] Tutorial cannot be skipped (skip button is disabled per spec)
- [ ] Tutorial doesn't block game functionality

## Future Enhancements

Possible improvements:
- Add visual highlighting of the new special module
- Add animated arrows pointing to the special module
- Allow replaying tutorials from a settings menu
- Add localization support for other languages

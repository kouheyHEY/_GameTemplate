# Implement Direct and Concise Scenario Text

## 1. Goal

Refine the text in all episode JSON files (`public/data/episodes/*.json`) to be more direct, objective, and system-like, removing excessive literary or novel-like expressions.

## 2. Target Files

- `public/data/episodes/ep_00_tutorial.json`
- `public/data/episodes/ep_01_scrap_logic.json`
- `public/data/episodes/ep_challenge.json`
- `public/data/episodes/ep_abyssal_cipher.json`
- `public/data/episodes/ep_buggy_hero.json`
- `public/data/episodes/ep_digital_egg.json`
- `public/data/episodes/ep_legacy_guardian.json`
- `public/data/episodes/ep_main_01_founding.json`
- `public/data/episodes/ep_main_02_truth.json`
- `public/data/episodes/ep_noise_punk.json`
- `public/data/episodes/ep_star_delivery.json`

## 3. Changes Overview

### General Principles

- **From**: "Narrator/Character speech" (e.g., "I found this...", "Welcome to the abyss...")
- **To**: "System/Report style" (e.g., "Request: Analysis...", "Connection: Sector-Z...")
- **Tone**: Concise, professional, minimal adjectives.

### Specific Adjustments

#### `ep_00_tutorial.json`

- **Memo**: Simplify Director's welcome to a formal assignment briefing.
- **Investigate**: Shorten "Training program start" to "System Status: Training Mode".
- **Resolution**: Change "You have the aptitude..." to "Aptitude Confirmed. Assignment authorized."

#### `ep_01_scrap_logic.json`

- **Daily Note**: Change "He was in a bad mood..." to "Status: Unstable. Operator decision: Maintain manual control."
- **Final Message**: Change poetic "I am a calculator..." to "System Log: Shutdown sequence. Acknowledging user 'Yoshida'. Efficiency metrics ignored in favor of 'human rhythm'. End of service."

#### `ep_challenge.json`

- **Intro**: "Message received..." -> "System: Final Evaluation Sequence."
- **Questions**: Direct instruction "Solve sequence", "Calculate sum".
- **Resolution**: "Access Granted. All logical gates cleared."

#### Other Episodes

- Apply similar "System Log" or "Professional Report" styling to memos and resolution text.
- Standardize "HINT" formulas.

## 4. Verification

- Use `npm run dev:desktop` to manually inspect the text in the terminal.
- Ensure JSON validity is maintained.

# ゲーム進行システム設計書

**日付**: 2026-02-13  
**カテゴリ**: 設計  
**影響範囲**: ゲームフロー全体

## ゲーム進行の基本フロー

Console Psycometristのゲーム進行は、以下の3つのフェーズを繰り返すサイクル構造となります。

```
┌─────────────────────────────────────────────┐
│  Phase 1: メモの受信                        │
│  - ストーリーテキストの表示                 │
│  - 新しいファイル群の通知                   │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Phase 2: ファイル解析・謎解き              │
│  - ファイルの解凍・閲覧                     │
│  - コンソールコマンドでの調査               │
│  - パズル・謎の解明                         │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  Phase 3: ストーリー進行                    │
│  - 解明した情報の報告                       │
│  - ストーリーの展開                         │
│  - 次のメモへ（Phase 1へ戻る）              │
└─────────────────────────────────────────────┘
```

## Phase 1: メモの受信

### 概要

プレイヤーは「メモ」という形式でストーリーテキストを受け取ります。
メモには簡単なストーリー説明と、添付ファイルへの言及が含まれます。

### 実装要素

- **メモビューア**: テキスト形式のメモを表示するUI
- **ファイル通知**: 新しいファイルが利用可能になったことを通知
- **メモ履歴**: 過去のメモを再確認できる機能

### データ構造例

```json
{
    "id": "memo_01",
    "type": "memo",
    "title": "初回接続",
    "text": "システムへようこそ。\n添付ファイルを確認してください。",
    "attachedFiles": ["system_log.txt", "config.dat"],
    "nextPhase": "investigate_01"
}
```

## Phase 2: ファイル解析・謎解き

### 概要

プレイヤーはコンソール上でファイルを操作し、隠された情報を見つけ出します。
ファイル内のヒントやパターンを解析することで、謎を解き明かします。

### 実装要素

- **ファイルシステム**: 仮想的なファイル構造
- **コマンドシステム**: `cat`, `ls`, `grep`, `decode`などのコマンド
- **パズルメカニクス**: 暗号解読、ログ解析、パターン発見など

### コマンド例

```
> ls
system_log.txt  config.dat  encrypted.bin

> cat system_log.txt
[2026-02-13 10:00] Connection established
[2026-02-13 10:01] User authentication: FAILED
[2026-02-13 10:02] Emergency protocol activated

> decode encrypted.bin --key=emergency
Decoded: "The truth is in the timestamps"
```

### パズルの種類

1. **ログ解析**: タイムスタンプやエラーコードから情報を抽出
2. **暗号解読**: 簡単な暗号（シーザー暗号、Base64など）の解読
3. **パターン認識**: ファイル名や内容のパターンから規則性を発見
4. **コマンド組み合わせ**: 複数のコマンドを組み合わせて情報を得る

## Phase 3: ストーリー進行

### 概要

謎を解いた後、プレイヤーは発見した情報を報告し、ストーリーが進行します。
新たな展開が明かされ、次のメモが届きます。

### 実装要素

- **解答システム**: プレイヤーの発見を確認
- **ストーリー分岐**: 発見内容によって異なる展開
- **進捗管理**: どこまで進んだかを記録

### データ構造例

```json
{
    "id": "resolution_01",
    "type": "resolution",
    "requiredDiscovery": "emergency_protocol",
    "text": "その通りです。緊急プロトコルが発動していました。\n次のメモを確認してください。",
    "nextMemo": "memo_02"
}
```

## 技術実装の方針

### ファイルシステムの実装

- JSON形式で仮想ファイルシステムを定義
- ファイル内容、パーミッション、メタデータを管理

### コマンドシステムの実装

- コマンドパーサーの作成
- 各コマンドの実装（`CommandHandler`パターン）
- コマンド履歴とオートコンプリート

### 進行管理

- ゲーム状態（現在のフェーズ、解いた謎、閲覧したファイル）の保存
- セーブ/ロード機能

## データ構造の全体像

```typescript
interface GameState {
    currentPhase: "memo" | "investigate" | "resolution";
    currentMemoId: string;
    discoveredSecrets: string[];
    fileSystem: VirtualFileSystem;
    commandHistory: string[];
}

interface VirtualFile {
    name: string;
    content: string;
    type: "text" | "binary" | "encrypted";
    metadata?: {
        created: string;
        modified: string;
        permissions: string;
    };
}

interface Puzzle {
    id: string;
    requiredFiles: string[];
    requiredCommands?: string[];
    solution: string;
    hint?: string;
}
```

## 今後の実装ステップ

1. **Phase 1実装**: メモシステムとファイル通知
2. **Phase 2実装**: 仮想ファイルシステムとコマンドシステム
3. **Phase 3実装**: 解答判定とストーリー進行
4. **統合**: 3つのフェーズをシームレスに繋げる
5. **コンテンツ作成**: 実際のメモ、ファイル、パズルの作成

## 参考資料

- 初期構想書: `docs/history/2026-02-13_01_プロジェクト初期構想.md`
- DialogueManager実装: `src/game/managers/DialogueManager.ts`

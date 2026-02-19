# リリースワークフロー

このドキュメントは、ゲーム開発完了からリリースまでの手順をまとめたものです。

## 1. ビルド準備

### 1.1 バージョン情報の更新

`constants/Version.ts` (もしあれば) や `package.json` のバージョンを更新します。

```bash
npm version patch # 1.0.0 -> 1.0.1
# or
npm version minor # 1.0.0 -> 1.1.0
```

### 1.2 不要なコードの削除

- `console.log` やデバッグ用のコードが残っていないか確認します。
- `vite.config.ts` で `drop_console: true` が設定されている場合、ビルド時に自動削除されます。

## 2. ビルド実行

### 2.1 Web版 (ブラウザ)

ブラウザ向けにビルドを行います。

```bash
npm run build
```

- 出力先: `dist/`フォルダ
- このフォルダの中身をサーバー (Netlify, Vercel, GitHub Pages) にアップロードします。
- itch.io にアップロードする場合は、`dist` フォルダの中身をZIP圧縮します。

### 2.2 デスクトップ版 (Electron)

Windows, Mac, Linux 向けのインストーラーまたは実行可能ファイルを生成します。

```bash
# Windows
npm run build:desktop:win

# Mac
npm run build:desktop:mac

# Linux
npm run build:desktop:linux

# 全て
npm run build:desktop
```

- 出力先: `dist-electron/` または `build/desktop/` (設定による)

## 3. 動作確認 (QA)

リリース前に以下の項目を確認します。

### ブラウザ版

- [ ] 主要ブラウザ (Chrome, Edge, Firefox) で動作するか
- [ ] ロード時間は問題ないか
- [ ] エラーログが出ていないか (F12 開発者ツール)

### デスクトップ版

- [ ] インストール/アンインストールが正常にできるか
- [ ] アプリアイコンが表示されているか
- [ ] ウィンドウサイズやフルスクリーン切り替えは正常か

## 4. リリース用素材の準備

ストアや配布サイトに必要な素材を準備します。

- [ ] **アイコン**: 512x512, 1024x1024 など
- [ ] **スクリーンショット**: ゲームプレイ画面の魅力的なシーン (3~5枚)
- [ ] **バナー**: ストアごとの推奨サイズ
- [ ] **トレーラー動画**: (あれば) YouTubeなどにアップロード
- [ ] **説明文**: `docs/GameDescription_Template.md` を使用して作成

## 5. デプロイ

### itch.io

1. プロジェクトページを作成
2. `dist` フォルダをZIP圧縮したものを「HTML5」としてアップロード
3. `Embed in page` にチェックを入れる
4. viewport サイズ (例: 1280x720) を設定

### Steam (デスクトップ版)

1. Steamworks SDK を使用してビルドをアップロード
2. ストアページの審査提出
3. リリース日の設定

## 6. リリース後

- **バグ報告の監視**: SNSやDiscordでのユーザーフィードバックを確認
- **ホットフィックス**: 重大なバグがあれば修正版 (`v1.0.1`) を即座にリリース
- **ポストモーテム**: `docs/Postmortem_Template.md` を使用して振り返りを行う

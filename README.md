# 🎯 C++ Card Learning

カードを並べてC++を学ぶ学習サイト（TypeScript版）

## ✨ 特徴

- **テーマ切り替え** - シンプル / ターミナル風 を切り替え可能
- **順不同対応** - 同じグループの行は順番を入れ替えてもOK
- **ブロック単位** - メソッド全体など、複数行をセットで順不同に

## 🎨 順不同システム

同じ色の左ボーダーを持つ行は **順不同OK** です：

| 色 | グループ |
|----|----------|
| 🩷 ピンク | #include |
| 💛 黄 | Point メンバ変数 |
| 💚 緑 | Point コンストラクタ |
| 🩵 シアン | Rectangle メンバ変数 |
| 💙 青 | Rectangle コンストラクタ |
| 💜 紫 | メソッド (area/perimeter) |
| 🧡 オレンジ | 演算子 (<</>>) |

## 📝 問題の書き方

### 通常の行（順序固定）
```typescript
{ cards: ['#include <iostream>'] }
```

### 順不同の行（同じgroupは入れ替えOK）
```typescript
{ cards: ['int x = 10;'], group: 'vars' }
{ cards: ['int y = 20;'], group: 'vars' }
```

### ブロック単位で順不同（複数行をセットで移動）
```typescript
{ cards: ['float area() const'], group: 'methods', blockId: 'area' }
{ cards: ['{'], group: 'methods', blockId: 'area' }
{ cards: ['    return width * height;'], group: 'methods', blockId: 'area' }
{ cards: ['}'], group: 'methods', blockId: 'area' }

{ cards: ['float perimeter() const'], group: 'methods', blockId: 'perimeter' }
{ cards: ['{'], group: 'methods', blockId: 'perimeter' }
{ cards: ['    return 2 * (width + height);'], group: 'methods', blockId: 'perimeter' }
{ cards: ['}'], group: 'methods', blockId: 'perimeter' }
```

↑ area全体とperimeter全体が順不同で入れ替え可能

## 🚀 デプロイ手順

### 1. ローカルで確認

```bash
npm install
npm run dev
```

http://localhost:3000 で確認

### 2. GitHubにプッシュ

```bash
git init
git add .
git commit -m "初回コミット"
git remote add origin https://github.com/あなた/cpp-card-learning.git
git push -u origin main
```

### 3. Vercelでデプロイ

1. [vercel.com](https://vercel.com) にGitHubでログイン
2. 「Add New」→「Project」
3. リポジトリ選択 → 「Deploy」

完了！🎉

## 📁 ファイル構成

```
cpp-card-learning/
├── app/
│   ├── layout.tsx         # レイアウト
│   ├── page.tsx           # ホーム
│   ├── globals.css
│   └── lesson/[id]/
│       └── page.tsx       # レッスン画面
├── components/
│   ├── Header.tsx
│   └── CardBuilder.tsx
├── lib/
│   └── lessons.ts         # 問題データ（型付き）
├── tsconfig.json          # TypeScript設定
└── package.json
```

## 🎮 レッスン追加方法

`lib/lessons.ts` の `lessons` 配列に追加：

```typescript
{
  id: 'unique_id',
  title: 'レッスン名',
  description: '説明',
  goal: 'ミッション',
  correct: ['正解の', '配列'],
  cards: ['カード', '一覧'],
  cardExplanations: {
    'カード': '説明',
  },
  hints: ['ヒント'],
  expectedOutput: '出力結果',
}
```

## 📝 型定義

```typescript
type Lesson = {
  id: string;
  title: string;
  description: string;
  goal: string;
  correct: string[];
  cards: string[];
  cardExplanations: Record<string, string>;
  hints: string[];
  expectedOutput: string;
};
```

型があるのでエディタ補完が効きます！

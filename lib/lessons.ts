// 正解行の型定義
export type CorrectLine = {
  cards: string[];
  group?: string;    // 同じgroupは順不同OK
  blockId?: string;  // 同じblockIdはセットで移動
};

// レッスンの型定義
export type Lesson = {
  id: string;
  title: string;
  description: string;
  goal: string;
  correct: CorrectLine[];  // CorrectLine の配列
  cards: string[];
  cardExplanations: Record<string, string>;
  hints: string[];
  expectedOutput: string;
};

// ========================================
// 判定ヘルパー関数
// ========================================

// 行が一致するか（カード配列の比較）
function linesMatch(placed: string[], correct: string[]): boolean {
  if (placed.length !== correct.length) return false;
  return placed.every((card, i) => card === correct[i]);
}

// ブロックに分割（連続する同じblockIdをグループ化）
type Block = {
  lines: string[][];
  correctLines: CorrectLine[];
  group?: string;
  blockId?: string;
};

function splitIntoBlocks(correct: CorrectLine[]): Block[] {
  const blocks: Block[] = [];
  let currentBlock: Block | null = null;

  for (const line of correct) {
    const blockId = line.blockId;
    
    if (blockId && currentBlock?.blockId === blockId) {
      currentBlock.correctLines.push(line);
    } else {
      if (currentBlock) blocks.push(currentBlock);
      currentBlock = {
        lines: [],
        correctLines: [line],
        group: line.group,
        blockId: line.blockId,
      };
    }
  }
  if (currentBlock) blocks.push(currentBlock);
  
  return blocks;
}

// メイン判定関数
export function checkAnswer(placed: string[][], correct: CorrectLine[]): boolean {
  if (placed.length !== correct.length) return false;

  const blocks = splitIntoBlocks(correct);
  
  let placedIndex = 0;
  for (const block of blocks) {
    block.lines = [];
    for (let i = 0; i < block.correctLines.length; i++) {
      if (placedIndex >= placed.length) return false;
      block.lines.push(placed[placedIndex]);
      placedIndex++;
    }
  }

  const groupMap = new Map<string, Block[]>();
  const ungroupedBlocks: Block[] = [];

  for (const block of blocks) {
    if (block.group) {
      if (!groupMap.has(block.group)) {
        groupMap.set(block.group, []);
      }
      groupMap.get(block.group)!.push(block);
    } else {
      ungroupedBlocks.push(block);
    }
  }

  // グループなしブロックは順序通りチェック
  for (const block of ungroupedBlocks) {
    for (let i = 0; i < block.correctLines.length; i++) {
      if (!linesMatch(block.lines[i], block.correctLines[i].cards)) {
        return false;
      }
    }
  }

  // グループありブロックは順不同でチェック
  for (const groupBlocks of Array.from(groupMap.values())) {
    const placedBlockContents = groupBlocks.map((b: Block) =>
      (b.lines ?? []).map((line: string[]) => line.join('|')).join('||')
    );

    const correctBlockContents = groupBlocks.map((b: Block) =>
      b.correctLines.map((cl: CorrectLine) => cl.cards.join('|')).join('||')
    );

    const sortedPlaced = placedBlockContents.slice().sort();
    const sortedCorrect = correctBlockContents.slice().sort();

    if (sortedPlaced.length !== sortedCorrect.length) return false;
    for (let i = 0; i < sortedPlaced.length; i++) {
      if (sortedPlaced[i] !== sortedCorrect[i]) return false;
    }
  }

  return true;
}

// ========================================
// レッスンデータ
// ========================================
export const lessons: Lesson[] = [
  // ========================================
  // 基本レッスン1: Hello World
  // ========================================
  {
    id: '1-2',
    title: 'Print「Hello, World!」',
    description: '最初のC++プログラム。画面に文字を表示してみよう。',
    goal: '「Hello, World!」を出力する',
    correct: [
      { cards: ['#include', '<iostream>'] },
      { cards: ['using', 'namespace', 'std', ';'] },
      { cards: ['int', 'main()', '{'] },
      { cards: ['    cout', '<<', '"Hello, World!"', ';'] },
      { cards: ['    return 0',';'] },
      { cards: ['}'] },
    ],
    cards: [
      '#include','<iostream>',
      'using', 'namespace', 'std', ';',
      'int', 'main()', '{',
      '    cout', '<<', '"Hello, World!"', ';',
      '    return 0',';',
      '}',
    ],
    cardExplanations: {
    },
    hints: [
    ],
    expectedOutput: 'Hello, World!',
  },
  // ========================================
  // 11-1: Point & Rectangle クラス（本格版）
  // ========================================
  {
    id: '11-1',
    title: 'Point & Rectangle クラス',
    description: 'Point と Rectangle クラスを実装しよう。順不同の箇所があるよ！',
    goal: '矩形クラスを完成させよう（面積・周長・入出力演算子）',
    correct: [
      // ========== #include（順不同） ==========
      { cards: ['#include <iostream>'], group: 'includes' },
      { cards: ['#include <algorithm>'], group: 'includes' },
      
      // ========== Pointクラス ==========
      { cards: ['class Point'] },
      { cards: ['{'] },
      { cards: ['public:'] },
      { cards: ['    float x;'], group: 'point_members' },
      { cards: ['    float y;'], group: 'point_members' },
      { cards: ['    Point() : x(0.0f), y(0.0f) {}'], group: 'point_ctors' },
      { cards: ['    Point(float x, float y) : x(x), y(y) {}'], group: 'point_ctors' },
      { cards: ['};'] },
      
      // ========== Rectangleクラス ==========
      { cards: ['class Rectangle'] },
      { cards: ['{'] },
      { cards: ['private:'] },
      { cards: ['    Point pt1;'], group: 'rect_members' },
      { cards: ['    Point pt2;'], group: 'rect_members' },
      { cards: ['public:'] },
      
      // デフォルトコンストラクタ（ブロック）
      { cards: ['    Rectangle()'], group: 'rect_ctors', blockId: 'ctor_default' },
      { cards: ['    {'], group: 'rect_ctors', blockId: 'ctor_default' },
      { cards: ['        pt1 = Point(0.0f, 0.0f);'], group: 'rect_ctors', blockId: 'ctor_default' },
      { cards: ['        pt2 = Point(1.0f, 1.0f);'], group: 'rect_ctors', blockId: 'ctor_default' },
      { cards: ['    }'], group: 'rect_ctors', blockId: 'ctor_default' },
      
      // 引数付きコンストラクタ（ブロック）
      { cards: ['    Rectangle(const Point &p1, const Point &p2)'], group: 'rect_ctors', blockId: 'ctor_args' },
      { cards: ['    {'], group: 'rect_ctors', blockId: 'ctor_args' },
      { cards: ['        pt1 = Point(std::min(p1.x, p2.x), std::min(p1.y, p2.y));'], group: 'rect_ctors', blockId: 'ctor_args' },
      { cards: ['        pt2 = Point(std::max(p1.x, p2.x), std::max(p1.y, p2.y));'], group: 'rect_ctors', blockId: 'ctor_args' },
      { cards: ['    }'], group: 'rect_ctors', blockId: 'ctor_args' },
      
      // area メソッド（ブロック）
      { cards: ['    float area() const'], group: 'rect_methods', blockId: 'method_area' },
      { cards: ['    {'], group: 'rect_methods', blockId: 'method_area' },
      { cards: ['        float width = pt2.x - pt1.x;'], group: 'rect_methods', blockId: 'method_area' },
      { cards: ['        float height = pt2.y - pt1.y;'], group: 'rect_methods', blockId: 'method_area' },
      { cards: ['        return width * height;'], group: 'rect_methods', blockId: 'method_area' },
      { cards: ['    }'], group: 'rect_methods', blockId: 'method_area' },
      
      // perimeter メソッド（ブロック）
      { cards: ['    float perimeter() const'], group: 'rect_methods', blockId: 'method_perimeter' },
      { cards: ['    {'], group: 'rect_methods', blockId: 'method_perimeter' },
      { cards: ['        float width = pt2.x - pt1.x;'], group: 'rect_methods', blockId: 'method_perimeter' },
      { cards: ['        float height = pt2.y - pt1.y;'], group: 'rect_methods', blockId: 'method_perimeter' },
      { cards: ['        return 2 * (width + height);'], group: 'rect_methods', blockId: 'method_perimeter' },
      { cards: ['    }'], group: 'rect_methods', blockId: 'method_perimeter' },
      
      // operator<< （ブロック）
      { cards: ['    friend std::ostream& operator<<(std::ostream &os, const Rectangle &r)'], group: 'rect_operators', blockId: 'op_out' },
      { cards: ['    {'], group: 'rect_operators', blockId: 'op_out' },
      { cards: ['        os << "[(" << r.pt1.x << ", " << r.pt1.y << "), "'], group: 'rect_operators', blockId: 'op_out' },
      { cards: ['           << "(" << r.pt2.x << ", " << r.pt2.y << ")], "'], group: 'rect_operators', blockId: 'op_out' },
      { cards: ['           << "area = " << r.area();'], group: 'rect_operators', blockId: 'op_out' },
      { cards: ['        return os;'], group: 'rect_operators', blockId: 'op_out' },
      { cards: ['    }'], group: 'rect_operators', blockId: 'op_out' },
      
      // operator>> （ブロック）
      { cards: ['    friend std::istream& operator>>(std::istream &is, Rectangle &r)'], group: 'rect_operators', blockId: 'op_in' },
      { cards: ['    {'], group: 'rect_operators', blockId: 'op_in' },
      { cards: ['        float x1, y1, x2, y2;'], group: 'rect_operators', blockId: 'op_in' },
      { cards: ['        is >> x1 >> y1 >> x2 >> y2;'], group: 'rect_operators', blockId: 'op_in' },
      { cards: ['        r.pt1 = Point(std::min(x1, x2), std::min(y1, y2));'], group: 'rect_operators', blockId: 'op_in' },
      { cards: ['        r.pt2 = Point(std::max(x1, x2), std::max(y1, y2));'], group: 'rect_operators', blockId: 'op_in' },
      { cards: ['        return is;'], group: 'rect_operators', blockId: 'op_in' },
      { cards: ['    }'], group: 'rect_operators', blockId: 'op_in' },
      
      { cards: ['};'] },
      
      // ========== main（固定） ==========
      { cards: ['int main()'] },
      { cards: ['{'] },
      { cards: ['    using namespace std;'] },
      { cards: ['    Rectangle r1;'] },
      { cards: ['    Rectangle r2(Point(3.0f, 2.0f), Point(0.6f, 0.5f));'] },
      { cards: ['    Rectangle r3;'] },
      { cards: ['    cout << "矩形の座標を、x1 y1 x2 y2 の形式で入力してください：";'] },
      { cards: ['    cin >> r3;'] },
      { cards: ['    cout << "r1 = " << r1 << "\\n";'] },
      { cards: ['    cout << "r2 = " << r2 << "\\n";'] },
      { cards: ['    cout << "r3 = " << r3 << "\\n";'] },
      { cards: ['}'] },
    ],
    cards: [
      // ===== includes =====
      '#include <iostream>',
      '#include <algorithm>',
      
      // ===== Point クラス =====
      'class Point',
      'public:',
      '    float x;',
      '    float y;',
      '    Point() : x(0.0f), y(0.0f) {}',
      '    Point(float x, float y) : x(x), y(y) {}',
      
      // ===== Rectangle クラス =====
      'class Rectangle',
      'private:',
      '    Point pt1;',
      '    Point pt2;',
      
      // コンストラクタ
      '    Rectangle()',
      '    Rectangle(const Point &p1, const Point &p2)',
      '        pt1 = Point(0.0f, 0.0f);',
      '        pt2 = Point(1.0f, 1.0f);',
      '        pt1 = Point(std::min(p1.x, p2.x), std::min(p1.y, p2.y));',
      '        pt2 = Point(std::max(p1.x, p2.x), std::max(p1.y, p2.y));',
      
      // メソッド
      '    float area() const',
      '    float perimeter() const',
      '        float width = pt2.x - pt1.x;',
      '        float height = pt2.y - pt1.y;',
      '        return width * height;',
      '        return 2 * (width + height);',
      
      // 演算子
      '    friend std::ostream& operator<<(std::ostream &os, const Rectangle &r)',
      '    friend std::istream& operator>>(std::istream &is, Rectangle &r)',
      '        os << "[(" << r.pt1.x << ", " << r.pt1.y << "), "',
      '           << "(" << r.pt2.x << ", " << r.pt2.y << ")], "',
      '           << "area = " << r.area();',
      '        return os;',
      '        float x1, y1, x2, y2;',
      '        is >> x1 >> y1 >> x2 >> y2;',
      '        r.pt1 = Point(std::min(x1, x2), std::min(y1, y2));',
      '        r.pt2 = Point(std::max(x1, x2), std::max(y1, y2));',
      '        return is;',
      
      // 共通パーツ（複数回使用）
      '{',
      '    {',
      '    }',
      '};',
      '}',
      
      // main
      'int main()',
      '    using namespace std;',
      '    Rectangle r1;',
      '    Rectangle r2(Point(3.0f, 2.0f), Point(0.6f, 0.5f));',
      '    Rectangle r3;',
      '    cout << "矩形の座標を、x1 y1 x2 y2 の形式で入力してください：";',
      '    cin >> r3;',
      '    cout << "r1 = " << r1 << "\\n";',
      '    cout << "r2 = " << r2 << "\\n";',
      '    cout << "r3 = " << r3 << "\\n";',
      
      // ===== ダミーカード =====
      '#include <stdio.h>',
      'void main()',
      '        return;',
      '    int x;',
    ],
    cardExplanations: {
      '#include <iostream>': '入出力 (cout, cin) 用ヘッダ',
      '#include <algorithm>': 'std::min, std::max 用ヘッダ',
      'class Point': 'Point クラスの宣言',
      'class Rectangle': 'Rectangle クラスの宣言',
      'public:': '外部からアクセス可能',
      'private:': 'クラス内部のみアクセス可能',
      '    float x;': 'x座標（メンバ変数）',
      '    float y;': 'y座標（メンバ変数）',
      '    Point() : x(0.0f), y(0.0f) {}': 'Point のデフォルトコンストラクタ',
      '    Point(float x, float y) : x(x), y(y) {}': 'Point の引数付きコンストラクタ',
      '    Point pt1;': '左下の頂点',
      '    Point pt2;': '右上の頂点',
      '    Rectangle()': 'Rectangle のデフォルトコンストラクタ',
      '    Rectangle(const Point &p1, const Point &p2)': 'Rectangle の引数付きコンストラクタ',
      '    float area() const': '面積を計算',
      '    float perimeter() const': '周長を計算',
      '    friend std::ostream& operator<<(std::ostream &os, const Rectangle &r)': '出力演算子',
      '    friend std::istream& operator>>(std::istream &is, Rectangle &r)': '入力演算子',
      '#include <stdio.h>': '⚠️ C言語用（C++では iostream）',
      'void main()': '⚠️ int main() が正しい',
    },
    hints: [
      '💡 #include の順番は自由だよ',
      '💡 Point クラスを先に、Rectangle を後に',
      '💡 Point の float x, y は順不同OK',
      '💡 Point のコンストラクタ2つは順不同OK',
      '💡 Rectangle の pt1, pt2 は順不同OK',
      '💡 Rectangle のコンストラクタ2つは順不同OK（ブロック単位）',
      '💡 area() と perimeter() は順不同OK（ブロック単位）',
      '💡 operator<< と operator>> は順不同OK（ブロック単位）',
      '💡 main 内は固定順',
    ],
    expectedOutput: 'r1 = [(0, 0), (1, 1)], area = 1\nr2 = [(0.6, 0.5), (3, 2)], area = 3.6\nr3 = (入力による)',
  },
];

// IDでレッスンを取得
export function getLessonById(id: string): Lesson | undefined {
  return lessons.find(lesson => lesson.id === id);
}

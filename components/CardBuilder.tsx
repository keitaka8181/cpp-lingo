'use client';

import { useState, useEffect, useRef } from 'react';
import type { Lesson } from '@/lib/lessons';
import { checkAnswer } from '@/lib/lessons';
import { useTheme } from '@/lib/theme-context';

type Props = {
  lesson: Lesson;
};

export default function CardBuilder({ lesson }: Props) {
  const { theme } = useTheme();
  
  const [availableCards, setAvailableCards] = useState<string[]>([]);
  const [placedCards, setPlacedCards] = useState<string[][]>([]);
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  
  // ターミナルテーマ用
  const [typingText, setTypingText] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    resetLesson();
  }, [lesson]);

  const resetLesson = () => {
    const shuffled = [...lesson.cards].sort(() => Math.random() - 0.5);
    setAvailableCards(shuffled);
    // 正解の行数分の空配列を用意
    setPlacedCards(lesson.correct.map(() => []));
    setSelectedRow(0);
    setResult(null);
    setShowHint(false);
    setHintLevel(0);
    setTypingText('');
    setIsTyping(false);
  };

  // カードを選択中の行に追加
  const handleCardClick = (card: string, cardIndex: number) => {
    if (result === 'correct' || isTyping) return;
  
    // インデックスで特定の1枚だけ削除
    setAvailableCards(prev => prev.filter((_, i) => i !== cardIndex));
    setPlacedCards(prev => prev.map((row, i) => 
      i === selectedRow ? [...row, card] : row
    ));
    setResult(null);
  };

  // 配置済みカードを削除してavailableCardsに戻す
  const handlePlacedCardClick = (rowIndex: number, colIndex: number, card: string) => {
    if (result === 'correct' || isTyping) return;
    
    setPlacedCards(prev => prev.map((row, i) => 
      i === rowIndex ? row.filter((_, j) => j !== colIndex) : row
    ));
    setAvailableCards(prev => [...prev, card]);
    setResult(null);
  };

  // 行を選択
  const handleRowClick = (rowIndex: number) => {
    if (result === 'correct' || isTyping) return;
    setSelectedRow(rowIndex);
  };

  // タイピング演出（ターミナルテーマ用）
  const typeCode = async (code: string) => {
    setIsTyping(true);
    setTypingText('');
    for (let i = 0; i <= code.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 15));
      setTypingText(code.slice(0, i));
    }
    setIsTyping(false);
  };

  // 正解判定（順不同対応）
  const handleCheckAnswer = async () => {
    const isCorrect = checkAnswer(placedCards, lesson.correct);
    
    if (isCorrect) {
      if (theme === 'terminal') {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 500);
      }
      setResult('correct');
      if (theme === 'terminal') {
        // 2次元配列を文字列に変換（各行を結合）
        const fullCode = lesson.correct.map(line => line.cards.join(' ')).join('\n');
        await typeCode(fullCode);
      }
    } else {
      setResult('incorrect');
      if (theme === 'terminal' && containerRef.current) {
        containerRef.current.classList.add('shake');
        setTimeout(() => containerRef.current?.classList.remove('shake'), 500);
      }
    }
  };

  const showNextHint = () => {
    setShowHint(true);
    if (hintLevel < lesson.hints.length - 1) {
      setHintLevel(prev => prev + 1);
    }
  };

  // 配置済みカードが1つでもあるか
  const hasAnyCards = placedCards.some(row => row.length > 0);

  // グループ情報を取得（UIでの表示用）
  const getRowGroup = (rowIndex: number): string | undefined => {
    return lesson.correct[rowIndex]?.group;
  };

  // ========================================
  // シンプルテーマ
  // ========================================
  if (theme === 'simple') {
    return (
      <div className="max-w-3xl mx-auto">
        {/* レッスン情報 */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-md border-l-4 border-indigo-500">
          <h1 className="text-xl font-bold text-indigo-700 mb-1">{lesson.title}</h1>
          <p className="text-gray-600">{lesson.description}</p>
        </div>

        {/* ミッション */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6">
          <h2 className="font-bold text-indigo-700 mb-1">🎮 ミッション</h2>
          <p className="text-gray-700">{lesson.goal}</p>
        </div>

        {/* 成功演出 */}
        {result === 'correct' && (
          <div className="bg-green-50 border-2 border-green-400 rounded-xl p-6 mb-6 text-center">
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-2xl font-bold text-green-700 mb-4">正解！</h2>
            <div className="bg-black rounded-lg p-3 text-green-400 font-mono text-left text-sm">
              <div className="text-gray-500 text-xs mb-1">出力結果:</div>
              <pre className="whitespace-pre-wrap">{lesson.expectedOutput}</pre>
            </div>
          </div>
        )}

        {/* 失敗メッセージ */}
        {result === 'incorrect' && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤔</span>
              <div>
                <h3 className="font-bold text-yellow-800">おしい！もう少し！</h3>
                <p className="text-yellow-700 text-sm">順番を確認してみよう。同じ色の行は順不同OKだよ！</p>
              </div>
            </div>
          </div>
        )}

        {/* ヒント */}
        {showHint && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-blue-800">{lesson.hints[hintLevel]}</p>
            {hintLevel < lesson.hints.length - 1 && (
              <p className="text-blue-500 text-sm mt-2">さらにヒントが必要？ヒントボタンを押してね</p>
            )}
          </div>
        )}

        {/* 組み立てエリア */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
          <h2 className="font-bold text-gray-700 mb-1 flex items-center gap-2">
            <span className="text-xl">📝</span> 組み立てエリア
          </h2>
          <p className="text-sm text-gray-500 mb-3">行をクリックして選択 → カードをクリックで追加 | 同じ色の行は順不同OK</p>
          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
            <div className="space-y-1">
              {placedCards.map((row, rowIndex) => {
                const group = getRowGroup(rowIndex);
                // グループに応じた背景色
                const groupColors: Record<string, string> = {
                  'includes': 'border-l-2 border-pink-500',
                  'point_members': 'border-l-2 border-yellow-500',
                  'point_ctors': 'border-l-2 border-green-500',
                  'rect_members': 'border-l-2 border-cyan-500',
                  'rect_ctors': 'border-l-2 border-blue-500',
                  'rect_methods': 'border-l-2 border-purple-500',
                  'rect_operators': 'border-l-2 border-orange-500',
                  'vars': 'border-l-2 border-emerald-500',
                };
                const groupColor = group ? groupColors[group] || 'border-l-2 border-gray-500' : '';
                
                return (
                  <div 
                    key={rowIndex} 
                    onClick={() => handleRowClick(rowIndex)}
                    className={`flex items-center gap-2 p-1 rounded cursor-pointer transition-all ${groupColor} ${
                      selectedRow === rowIndex 
                        ? 'bg-indigo-900/40 ring-1 ring-indigo-500' 
                        : 'hover:bg-gray-800'
                    }`}
                  >
                    {/* 行番号 */}
                    <span className={`text-xs w-6 select-none ${
                      selectedRow === rowIndex ? 'text-indigo-400' : 'text-gray-500'
                    }`}>
                      {String(rowIndex + 1).padStart(2, ' ')}
                    </span>
                    
                    {/* カード表示エリア */}
                    <div className="flex-1 flex flex-wrap gap-1 min-h-[24px] items-center">
                      {row.length === 0 ? (
                        <span className={`text-xs ${
                          selectedRow === rowIndex ? 'text-indigo-400' : 'text-gray-600'
                        }`}>
                          {selectedRow === rowIndex ? '▶ ここにカードを追加' : '（空）'}
                          {group && <span className="ml-2 text-gray-500">// 順不同OK</span>}
                        </span>
                      ) : (
                        row.map((card, colIndex) => (
                          <code
                            key={colIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlacedCardClick(rowIndex, colIndex, card);
                            }}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer text-xs ${
                              result === 'correct'
                                ? 'bg-green-900/30 text-green-400'
                                : 'bg-gray-800 text-gray-100 hover:bg-red-900/30 hover:text-red-300'
                            }`}
                          >
                            {card}
                          </code>
                        ))
                      )}
                    </div>

                    {/* 選択中マーク */}
                    {selectedRow === rowIndex && result !== 'correct' && (
                      <span className="text-indigo-400 text-xs">●</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* カードプール */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
          <h2 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
            <span className="text-xl">🃏</span> カード（クリックして並べよう）
          </h2>
          {availableCards.length === 0 ? (
            <div className="text-center py-4 text-gray-500">すべてのカードを使いました！</div>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
              {availableCards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(card, index)}
                  disabled={result === 'correct'}
                  className="group relative bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-indigo-200 hover:border-indigo-400 rounded-lg px-2 py-1 font-mono text-xs text-indigo-800 transition-all hover:scale-105 hover:shadow-md"
                >
                  {card}
                  {lesson.cardExplanations[card] && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 max-w-xs text-center">
                      {lesson.cardExplanations[card]}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 操作ボタン */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={handleCheckAnswer} disabled={!hasAnyCards || result === 'correct'}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-md">
            ✅ チェック！
          </button>
          <button onClick={showNextHint} disabled={result === 'correct'}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-md">
            💡 ヒント
          </button>
          <button onClick={resetLesson}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 shadow-md">
            🔄 やり直す
          </button>
        </div>

        {/* 凡例 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
          <h3 className="font-bold text-gray-700 mb-2">🎨 順不同グループの凡例</h3>
          <div className="flex flex-wrap gap-2">
            <span className="border-l-4 border-pink-500 pl-2">includes</span>
            <span className="border-l-4 border-yellow-500 pl-2">Point メンバ</span>
            <span className="border-l-4 border-green-500 pl-2">Point コンストラクタ</span>
            <span className="border-l-4 border-cyan-500 pl-2">Rect メンバ</span>
            <span className="border-l-4 border-blue-500 pl-2">Rect コンストラクタ</span>
            <span className="border-l-4 border-purple-500 pl-2">メソッド</span>
            <span className="border-l-4 border-orange-500 pl-2">演算子</span>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // ターミナルテーマ
  // ========================================
  return (
    <div ref={containerRef} className="max-w-3xl mx-auto relative">
      {/* 緑フラッシュ */}
      {showFlash && (
        <div className="fixed inset-0 bg-[#00ff41] opacity-20 pointer-events-none z-50 green-flash" />
      )}

      {/* レッスン情報 */}
      <div className="terminal-border rounded-lg p-4 mb-6 bg-[#161b22]">
        <div className="text-[#8b949e] text-xs mb-1">$ cat lesson.info</div>
        <h1 className="text-lg font-bold text-[#00ff41] mb-1">{lesson.title}</h1>
        <p className="text-[#8b949e] text-sm">// {lesson.description}</p>
      </div>

      {/* ミッション */}
      <div className="terminal-border rounded-lg p-4 mb-6 bg-[#161b22]">
        <div className="text-[#00d4ff] text-sm mb-1">[MISSION]</div>
        <p className="text-[#c9d1d9]">&gt; {lesson.goal}</p>
      </div>

      {/* 成功演出 */}
      {result === 'correct' && (
        <div className="terminal-border rounded-lg p-6 mb-6 bg-[#161b22] border-[#00ff41]">
          <div className="text-center mb-4">
            <div className="text-[#00ff41] text-2xl font-bold glow-green-strong mb-2">[SUCCESS]</div>
            <div className="text-[#00ff41]">// Compilation successful</div>
          </div>
          <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-sm max-h-48 overflow-y-auto">
            <div className="text-[#8b949e] text-xs mb-2">$ g++ main.cpp && ./a.out</div>
            <pre className="text-[#00ff41] whitespace-pre-wrap text-xs">
              {typingText}
              {isTyping && <span className="cursor-blink">▌</span>}
            </pre>
          </div>
          {!isTyping && (
            <div className="mt-4 bg-[#0d1117] rounded-lg p-4">
              <div className="text-[#8b949e] text-xs mb-1">Output:</div>
              <pre className="text-[#00ff41] glow-green whitespace-pre-wrap text-xs">{lesson.expectedOutput}</pre>
            </div>
          )}
        </div>
      )}

      {/* 失敗メッセージ */}
      {result === 'incorrect' && (
        <div className="terminal-border rounded-lg p-4 mb-6 bg-[#161b22] border-red-500">
          <div className="flex items-center gap-2">
            <span className="text-red-500 text-xl">[ERROR]</span>
            <div>
              <div className="text-red-400 font-bold">Compilation failed</div>
              <p className="text-[#8b949e] text-sm">// 同色の行は順不同OK</p>
            </div>
          </div>
        </div>
      )}

      {/* ヒント */}
      {showHint && (
        <div className="terminal-border rounded-lg p-4 mb-6 bg-[#161b22] border-[#00d4ff]">
          <div className="text-[#00d4ff] text-sm mb-1">[HINT]</div>
          <p className="text-[#c9d1d9]">{lesson.hints[hintLevel]}</p>
          {hintLevel < lesson.hints.length - 1 && (
            <p className="text-[#8b949e] text-sm mt-2">// さらにヒントが必要？</p>
          )}
        </div>
      )}

      {/* 組み立てエリア */}
      <div className="terminal-border rounded-lg p-4 mb-6 bg-[#161b22]">
        <div className="text-[#8b949e] text-xs mb-3">$ vim main.cpp <span className="text-[#00d4ff]">// 同色=順不同OK</span></div>
        <div className="bg-[#0d1117] rounded-lg p-4 font-mono text-xs border border-[#30363d] max-h-96 overflow-y-auto">
          <div className="space-y-1">
            {placedCards.map((row, rowIndex) => {
              const group = getRowGroup(rowIndex);
              // グループに応じたボーダー色
              const groupColors: Record<string, string> = {
                'includes': 'border-l-2 border-pink-500',
                'point_members': 'border-l-2 border-yellow-500',
                'point_ctors': 'border-l-2 border-green-500',
                'rect_members': 'border-l-2 border-cyan-500',
                'rect_ctors': 'border-l-2 border-blue-500',
                'rect_methods': 'border-l-2 border-purple-500',
                'rect_operators': 'border-l-2 border-orange-500',
                'vars': 'border-l-2 border-emerald-500',
              };
              const groupColor = group ? groupColors[group] || 'border-l-2 border-gray-500' : '';
              
              return (
                <div 
                  key={rowIndex} 
                  onClick={() => handleRowClick(rowIndex)}
                  className={`flex items-center gap-2 p-1 rounded cursor-pointer transition-all ${groupColor} ${
                    selectedRow === rowIndex 
                      ? 'bg-[#00ff41]/10 ring-1 ring-[#00ff41]/50' 
                      : 'hover:bg-[#1c2128]'
                  }`}
                >
                  {/* 行番号 */}
                  <span className={`text-xs w-6 select-none ${
                    selectedRow === rowIndex ? 'text-[#00ff41]' : 'text-[#8b949e]'
                  }`}>
                    {String(rowIndex + 1).padStart(2, ' ')}
                  </span>
                  
                  {/* カード表示エリア */}
                  <div className="flex-1 flex flex-wrap gap-1 min-h-[20px] items-center">
                    {row.length === 0 ? (
                      <span className={`text-xs ${
                        selectedRow === rowIndex ? 'text-[#00ff41]' : 'text-[#8b949e]'
                      }`}>
                        {selectedRow === rowIndex ? '▶ // insert here' : '// empty'}
                      </span>
                    ) : (
                      row.map((card, colIndex) => (
                        <code
                          key={colIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePlacedCardClick(rowIndex, colIndex, card);
                          }}
                          className={`px-1 py-0.5 rounded transition-all cursor-pointer ${
                            result === 'correct'
                              ? 'text-[#00ff41] glow-green'
                              : 'text-[#c9d1d9] hover:bg-red-900/30 hover:text-red-400'
                          }`}
                        >
                          {card}
                        </code>
                      ))
                    )}
                  </div>

                  {/* 選択中マーク */}
                  {selectedRow === rowIndex && result !== 'correct' && (
                    <span className="text-[#00ff41] cursor-blink">▌</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* カードプール */}
      <div className="terminal-border rounded-lg p-4 mb-6 bg-[#161b22]">
        <div className="text-[#8b949e] text-xs mb-3">$ ls ./snippets/</div>
        {availableCards.length === 0 ? (
          <div className="text-center py-4 text-[#8b949e]">// すべてのスニペットを使用しました</div>
        ) : (
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {availableCards.map((card, index) => (
              <button
                key={index}
                onClick={() => handleCardClick(card, index)}
                disabled={result === 'correct' || isTyping}
                className="group relative bg-[#0d1117] hover:bg-[#1c2128] disabled:opacity-50 disabled:cursor-not-allowed border border-[#30363d] hover:border-[#00ff41] rounded px-2 py-1 font-mono text-xs text-[#c9d1d9] hover:text-[#00ff41] transition-all"
              >
                {card}
                {lesson.cardExplanations[card] && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#161b22] border border-[#30363d] text-[#8b949e] text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 max-w-xs text-center">
                    // {lesson.cardExplanations[card]}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 操作ボタン */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={handleCheckAnswer} disabled={!hasAnyCards || result === 'correct' || isTyping}
          className="bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#21262d] disabled:text-[#8b949e] disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg transition-all">
          $ compile
        </button>
        <button onClick={showNextHint} disabled={result === 'correct' || isTyping}
          className="bg-[#1f6feb] hover:bg-[#388bfd] disabled:bg-[#21262d] disabled:text-[#8b949e] disabled:cursor-not-allowed text-white font-bold px-6 py-3 rounded-lg transition-all">
          $ hint
        </button>
        <button onClick={resetLesson} disabled={isTyping}
          className="bg-[#21262d] hover:bg-[#30363d] disabled:cursor-not-allowed text-[#c9d1d9] font-bold px-6 py-3 rounded-lg transition-all border border-[#30363d]">
          $ reset
        </button>
      </div>
    </div>
  );
}

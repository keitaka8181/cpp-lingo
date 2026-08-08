'use client';

import Link from 'next/link';
import { useTheme } from '@/lib/theme-context';

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  // シンプルテーマ
  if (theme === 'simple') {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <span className="font-bold text-indigo-700 text-lg">C++ カード学習</span>
          </Link>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <span>🖥️</span>
            <span className="hidden sm:inline">ターミナル風に変更</span>
          </button>
        </div>
      </header>
    );
  }

  // ターミナルテーマ
  return (
    <header className="bg-[#161b22] border-b border-[#30363d]">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-[#00ff41] group-hover:glow-green transition-all">$</span>
          <span className="text-[#00ff41] font-bold glow-green">cpp-learning</span>
          <span className="text-[#00ff41] cursor-blink">_</span>
        </Link>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-3 py-2 rounded-lg text-sm text-[#c9d1d9] transition-colors"
        >
          <span>☀️</span>
          <span className="hidden sm:inline">シンプルに変更</span>
        </button>
      </div>
    </header>
  );
}

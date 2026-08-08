'use client';

import Header from '@/components/Header';
import { lessons } from '@/lib/lessons';
import { useTheme } from '@/lib/theme-context';
import Link from 'next/link';

export default function Home() {
  const { theme } = useTheme();

  // シンプルテーマ
  if (theme === 'simple') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 theme-simple">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
              🎯 C++ カード学習
            </h1>
            <p className="text-xl text-gray-600">
              カードを並べてC++を学ぼう！<br />
              タイプミスなし、構文エラーなし、楽しく学べる！
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">📚 レッスン</h2>
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <Link 
                key={lesson.id} 
                href={`/lesson/${lesson.id}`}
                className="block"
              >
                <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-[1.02] border-l-4 border-indigo-500">
                  <div className="flex items-center gap-4">
                    <div className="text-2xl w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{lesson.title}</h3>
                      <p className="text-gray-500 text-sm">{lesson.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <footer className="mt-12 text-center text-gray-500 text-sm">
            <p>🎮 カードを並べて楽しくC++を学ぼう！</p>
          </footer>
        </main>
      </div>
    );
  }

  // ターミナルテーマ
  return (
    <div className="min-h-screen bg-[#0d1117] theme-terminal scanline">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <div className="text-[#00ff41] text-sm mb-2">// Welcome to</div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#00ff41] mb-4 glow-green-strong">
            &gt; C++ Card Learning_
          </h1>
          <p className="text-[#8b949e] font-mono">
            <span className="text-[#00d4ff]">console</span>.<span className="text-[#d2a8ff]">log</span>(<span className="text-[#a5d6ff]">&quot;カードを並べてC++を学ぼう&quot;</span>);
          </p>
        </div>

        <div className="terminal-border rounded-lg p-4 mb-8 bg-[#161b22]">
          <div className="text-[#8b949e] text-sm mb-2">$ system status</div>
          <div className="flex gap-6 text-sm">
            <div><span className="text-[#00ff41]">●</span> LESSONS: <span className="text-[#00ff41]">{lessons.length}</span></div>
            <div><span className="text-[#00ff41]">●</span> STATUS: <span className="text-[#00ff41]">READY</span></div>
            <div><span className="text-[#00ff41]">●</span> MODE: <span className="text-[#00ff41]">LEARNING</span></div>
          </div>
        </div>

        <div className="text-[#8b949e] text-sm mb-4">$ ls ./lessons/</div>
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <Link 
              key={lesson.id} 
              href={`/lesson/${lesson.id}`}
              className="block"
            >
              <div className="terminal-border hover-glow rounded-lg p-4 bg-[#161b22] transition-all hover:bg-[#1c2128]">
                <div className="flex items-center gap-4">
                  <div className="text-[#00ff41] font-bold text-lg w-8">
                    {String(index).padStart(2, '0')}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#00ff41] font-bold">{lesson.title}</h3>
                    <p className="text-[#8b949e] text-sm">// {lesson.description}</p>
                  </div>
                  <div className="text-[#00ff41]">&gt;</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-12 text-center text-[#8b949e] text-sm">
          <p>// Press any lesson to start_</p>
        </footer>
      </main>
    </div>
  );
}

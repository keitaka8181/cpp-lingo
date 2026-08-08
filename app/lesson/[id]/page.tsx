'use client';

import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import CardBuilder from '@/components/CardBuilder';
import { getLessonById, lessons } from '@/lib/lessons';
import { useTheme } from '@/lib/theme-context';
import Link from 'next/link';

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as string;
  const lesson = getLessonById(lessonId);
  const { theme } = useTheme();

  // レッスンが見つからない場合
  if (!lesson) {
    if (theme === 'simple') {
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 theme-simple">
          <Header />
          <main className="max-w-2xl mx-auto px-4 py-8 text-center">
            <div className="text-6xl mb-4">😵</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">レッスンが見つかりません</h1>
            <Link href="/" className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold">
              ホームに戻る
            </Link>
          </main>
        </div>
      );
    }
    return (
      <div className="min-h-screen bg-[#0d1117] theme-terminal scanline">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-8 text-center">
          <div className="text-6xl mb-4 text-red-500">[404]</div>
          <h1 className="text-xl font-bold text-red-400 mb-4">Error: Lesson not found</h1>
          <Link href="/" className="inline-block bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-3 rounded-lg font-bold">
            $ cd ~
          </Link>
        </main>
      </div>
    );
  }

  const currentIndex = lessons.findIndex(l => l.id === lesson.id);
  const nextLesson = lessons[currentIndex + 1];

  // シンプルテーマ
  if (theme === 'simple') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 theme-simple">
        <Header />
        
        <main className="px-4 py-8">
          <div className="max-w-2xl mx-auto mb-4">
            <Link href="/" className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800">
              ← レッスン一覧に戻る
            </Link>
          </div>

          <CardBuilder lesson={lesson} />

          {nextLesson && (
            <div className="max-w-2xl mx-auto mt-8 text-center">
              <Link
                href={`/lesson/${nextLesson.id}`}
                className="inline-flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-6 py-3 rounded-xl font-medium transition-colors"
              >
                次のレッスン: {nextLesson.title} →
              </Link>
            </div>
          )}

          <div className="max-w-2xl mx-auto mt-8 bg-white/70 rounded-xl p-4">
            <h3 className="font-bold text-gray-700 mb-2">📖 遊び方</h3>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• カードにマウスを乗せると説明が見えるよ</li>
              <li>• カードをクリックすると上のエリアに追加</li>
              <li>• 間違えたカードはクリックで戻せる</li>
              <li>• 全部並べたら「チェック！」を押そう</li>
            </ul>
          </div>
        </main>
      </div>
    );
  }

  // ターミナルテーマ
  return (
    <div className="min-h-screen bg-[#0d1117] theme-terminal scanline">
      <Header />
      
      <main className="px-4 py-8">
        <div className="max-w-2xl mx-auto mb-4">
          <Link href="/" className="inline-flex items-center gap-1 text-[#8b949e] hover:text-[#00ff41] transition-colors">
            <span className="text-[#00ff41]">$</span> cd .. <span className="text-[#8b949e]">// レッスン一覧に戻る</span>
          </Link>
        </div>

        <CardBuilder lesson={lesson} />

        {nextLesson && (
          <div className="max-w-2xl mx-auto mt-8 text-center">
            <Link
              href={`/lesson/${nextLesson.id}`}
              className="inline-flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-[#00ff41] px-6 py-3 rounded-lg font-medium transition-colors border border-[#30363d] hover:border-[#00ff41]"
            >
              $ next <span className="text-[#8b949e]">// {nextLesson.title}</span>
            </Link>
          </div>
        )}

        <div className="max-w-2xl mx-auto mt-8 terminal-border rounded-lg p-4 bg-[#161b22]">
          <div className="text-[#8b949e] text-xs mb-2">$ cat README.md</div>
          <div className="text-[#c9d1d9] text-sm space-y-1">
            <p><span className="text-[#00ff41]">•</span> カードにマウスを乗せると説明が見える</p>
            <p><span className="text-[#00ff41]">•</span> カードをクリックで配置</p>
            <p><span className="text-[#00ff41]">•</span> 配置済みカードをクリックで削除</p>
            <p><span className="text-[#00ff41]">•</span> 全部並べたら <span className="text-[#238636]">$ compile</span></p>
          </div>
        </div>
      </main>
    </div>
  );
}

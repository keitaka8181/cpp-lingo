'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'simple' | 'terminal';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'simple',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('simple');
  const [mounted, setMounted] = useState(false);

  // 初回読み込み
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'simple' || saved === 'terminal') {
      setTheme(saved);
    }
    setMounted(true);
  }, []);

  // テーマ変更時に保存
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'simple' ? 'terminal' : 'simple');
  };

  // hydration対策
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

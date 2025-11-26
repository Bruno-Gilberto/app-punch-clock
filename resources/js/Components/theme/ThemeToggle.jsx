import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './themeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full border border-border
                  text-foreground
                  hover:bg-accent bg-accent hover:text-accent-foreground transition shadow-md"
      title="Alternar tema"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeToggle;
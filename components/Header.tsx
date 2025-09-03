import React from 'react';
import { SocaLogoIcon, SunIcon, MoonIcon } from './IconComponents';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 p-4 border-b-2 border-border-color/50 bg-bg-light/50 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div
          onClick={onLogoClick}
          className="flex items-center group cursor-pointer"
          role="button"
          aria-label="Return to Code Review mode"
        >
          <SocaLogoIcon className="w-12 h-12 text-brand-primary transition-all duration-500 ease-out group-hover:drop-shadow-[0_0_8px_#00A9A5]" />
          <div className="ml-4">
            <h1 className="text-3xl font-bold text-text-primary tracking-wider transition-all duration-500 group-hover:text-brand-secondary">
              SOCA
            </h1>
            <p className="text-sm text-text-secondary tracking-widest">
              Smart Optimized Code Auditor
            </p>
          </div>
        </div>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-border-color/50 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors duration-300"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
        </button>
      </div>
    </header>
  );
};

export default Header;

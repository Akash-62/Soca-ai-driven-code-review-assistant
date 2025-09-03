

import React from 'react';
import { AppMode } from '../types';
import { UsersIcon } from './IconComponents';

interface ModeSelectorProps {
  selectedMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onSelectMode }) => {
  const baseClasses = "px-4 py-2 rounded-md font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-nowrap flex items-center gap-2";
  const activeClasses = "bg-brand-primary text-white shadow-[0_0_15px_rgba(0,169,165,0.5)]";
  const inactiveClasses = "bg-bg-dark text-text-secondary hover:bg-border-color hover:text-text-primary";

  return (
    <div className="flex items-center space-x-4">
      <label className="text-text-primary font-medium">Mode:</label>
      <div className="flex rounded-lg p-1 bg-bg-dark/50 border border-border-color">
        <button
          onClick={() => onSelectMode(AppMode.Review)}
          className={`${baseClasses} ${selectedMode === AppMode.Review ? activeClasses : inactiveClasses}`}
          aria-pressed={selectedMode === AppMode.Review}
        >
          {AppMode.Review}
        </button>
        <button
          onClick={() => onSelectMode(AppMode.Challenge)}
          className={`${baseClasses} ${selectedMode === AppMode.Challenge ? activeClasses : inactiveClasses}`}
          aria-pressed={selectedMode === AppMode.Challenge}
        >
          {AppMode.Challenge}
        </button>
        <button
          onClick={() => onSelectMode(AppMode.Multiplayer)}
          className={`${baseClasses} ${selectedMode === AppMode.Multiplayer ? activeClasses : inactiveClasses}`}
          aria-pressed={selectedMode === AppMode.Multiplayer}
        >
          <UsersIcon className="w-5 h-5" />
          {AppMode.Multiplayer}
        </button>
      </div>
    </div>
  );
};

export default ModeSelector;
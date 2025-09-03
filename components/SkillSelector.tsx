
import React from 'react';
import { SkillLevel } from '../types';

interface SkillSelectorProps {
  selectedLevel: SkillLevel;
  onSelectLevel: (level: SkillLevel) => void;
}

const SkillSelector: React.FC<SkillSelectorProps> = ({ selectedLevel, onSelectLevel }) => {
  const baseClasses = "px-4 py-2 rounded-md font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-nowrap";
  const activeClasses = "bg-brand-primary text-white shadow-[0_0_15px_rgba(0,169,165,0.5)]";
  const inactiveClasses = "bg-bg-dark text-text-secondary hover:bg-border-color hover:text-text-primary";

  return (
    <div className="flex items-center space-x-4">
      <label className="text-text-primary font-medium">Your Skill Level:</label>
      <div className="flex rounded-lg p-1 bg-bg-dark/50 border border-border-color">
        <button
          onClick={() => onSelectLevel(SkillLevel.Junior)}
          className={`${baseClasses} ${selectedLevel === SkillLevel.Junior ? activeClasses : inactiveClasses}`}
        >
          Junior
        </button>
        <button
          onClick={() => onSelectLevel(SkillLevel.Senior)}
          className={`${baseClasses} ${selectedLevel === SkillLevel.Senior ? activeClasses : inactiveClasses}`}
        >
          Senior
        </button>
      </div>
    </div>
  );
};

export default SkillSelector;

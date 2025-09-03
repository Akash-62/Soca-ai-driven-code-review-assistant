import React, { useState, useEffect, useRef } from 'react';
import { Player } from '../types';
import { TrophyIcon, XIcon } from './IconComponents';

interface ScoreboardProps {
  isOpen: boolean;
  onClose: () => void;
  players: [Player, Player];
  targetScore: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ isOpen, onClose, players, targetScore }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [scoreChangeIndex, setScoreChangeIndex] = useState<number | null>(null);
  const prevScores = useRef<[number, number]>([players[0].score, players[1].score]);

  useEffect(() => {
    // Check for score changes to trigger animation
    const newScores: [number, number] = [players[0].score, players[1].score];
    let changed = false;
    
    if (newScores[0] > prevScores.current[0]) {
      setScoreChangeIndex(0);
      changed = true;
    } else if (newScores[1] > prevScores.current[1]) {
      setScoreChangeIndex(1);
      changed = true;
    }
    
    if (changed) {
      setTimeout(() => setScoreChangeIndex(null), 800); // Corresponds to animation duration
    }

    prevScores.current = newScores;
  }, [players]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false); // Reset for next open
    }, 300); // Matches slide-out animation duration
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-bg-dark/80 backdrop-blur-md flex items-center justify-center z-[100] ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
      style={{ animationDuration: '300ms' }} // Shorter fade for responsiveness
      onClick={handleClose}
    >
      <div 
        className={`relative w-full max-w-lg p-8 bg-bg-light/80 backdrop-blur-xl rounded-2xl border-2 border-brand-primary/30 shadow-2xl ${isClosing ? 'animate-dematerialize' : 'animate-materialize'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-text-secondary hover:text-text-primary hover:bg-border-color/50 transition-colors"
          aria-label="Close scoreboard"
        >
          <XIcon className="w-6 h-6" />
        </button>
        
        <div className="flex flex-col items-center text-center">
            <TrophyIcon className="w-16 h-16 text-brand-secondary" />
            <h2 className="text-3xl font-bold text-text-primary mt-4">Match Scoreboard</h2>
            <p className="text-md text-text-secondary mt-1">First to <span className="font-bold text-brand-accent">{targetScore}</span> points wins!</p>
        </div>

        <div className="mt-8 space-y-4">
            {players.map((player, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-bg-dark/50 rounded-lg border border-border-color">
                    <span className="text-xl font-medium text-text-primary">{player.name}</span>
                    <span className={`text-3xl font-bold text-brand-primary transition-transform duration-300 ${scoreChangeIndex === index ? 'animate-score-update' : ''}`}>
                        {player.score}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
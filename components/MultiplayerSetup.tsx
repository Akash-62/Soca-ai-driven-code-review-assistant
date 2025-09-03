import React, { useState } from 'react';

interface MultiplayerSetupProps {
  onSetupComplete: (player1Name: string, player2Name: string, targetScore: number) => void;
}

const MultiplayerSetup: React.FC<MultiplayerSetupProps> = ({ onSetupComplete }) => {
  const [p1Name, setP1Name] = useState('Player 1');
  const [p2Name, setP2Name] = useState('Player 2');
  const [targetScore, setTargetScore] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (p1Name.trim() && p2Name.trim() && targetScore > 0) {
      onSetupComplete(p1Name.trim(), p2Name.trim(), targetScore);
    }
  };
  
  const inputClasses = "w-full p-3 bg-bg-dark/80 border-2 border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors";

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fade-in p-4">
      <div className="w-full max-w-md p-8 bg-bg-light/50 backdrop-blur-lg rounded-xl border border-border-color/50 shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-brand-secondary mb-6">Local Duel Setup</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="p1Name" className="block text-sm font-medium text-text-secondary mb-2">Player 1 Name</label>
            <input
              id="p1Name"
              type="text"
              value={p1Name}
              onChange={(e) => setP1Name(e.target.value)}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label htmlFor="p2Name" className="block text-sm font-medium text-text-secondary mb-2">Player 2 Name</label>
            <input
              id="p2Name"
              type="text"
              value={p2Name}
              onChange={(e) => setP2Name(e.target.value)}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label htmlFor="targetScore" className="block text-sm font-medium text-text-secondary mb-2">Points to Win</label>
            <input
              id="targetScore"
              type="number"
              value={targetScore}
              onChange={(e) => setTargetScore(parseInt(e.target.value, 10) || 1)}
              min="1"
              max="20"
              className={inputClasses}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full font-bold py-3 px-6 rounded-lg transition-all duration-300 bg-brand-primary text-white hover:shadow-[0_0_20px_#00A9A5] hover:scale-105 disabled:opacity-50"
            disabled={!p1Name.trim() || !p2Name.trim() || targetScore <= 0}
          >
            Start Duel
          </button>
        </form>
      </div>
    </div>
  );
};

export default MultiplayerSetup;

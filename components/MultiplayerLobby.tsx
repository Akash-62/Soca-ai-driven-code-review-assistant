import React from 'react';
import { UsersIcon, SwordsIcon } from './IconComponents';

interface MultiplayerLobbyProps {
  onSelectLocal: () => void;
  onSelectOnline: () => void;
}

const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({ onSelectLocal, onSelectOnline }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-wider">Multiplayer Hub</h1>
        <p className="text-lg text-text-secondary mt-2">Choose your arena, coder.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Local Duel Card */}
        <div 
            className="lobby-card bg-bg-light/50 backdrop-blur-lg rounded-xl p-8 text-center cursor-pointer"
            onClick={onSelectLocal}
        >
            <div className="flex justify-center items-center w-20 h-20 bg-brand-primary/20 rounded-full mx-auto mb-6">
                <UsersIcon className="w-10 h-10 text-brand-primary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Local Duel</h2>
            <p className="text-text-secondary mt-2">
                Two players, one screen. Battle it out with a friend right here, right now.
            </p>
        </div>

        {/* Online Duel Card */}
        <div 
            className="lobby-card bg-bg-light/50 backdrop-blur-lg rounded-xl p-8 text-center cursor-pointer"
            onClick={onSelectOnline}
        >
            <div className="flex justify-center items-center w-20 h-20 bg-brand-accent/20 rounded-full mx-auto mb-6">
                <SwordsIcon className="w-10 h-10 text-brand-accent" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Online Duel</h2>
            <p className="text-text-secondary mt-2">
                Create a private room with a passcode and challenge a friend remotely.
            </p>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerLobby;
import React, { useEffect, useRef } from 'react';
import { Player } from '../types';
import { TrophyIcon } from './IconComponents';

interface EndGameScreenProps {
  winner: Player;
  loser: Player;
  onPlayAgain: () => void;
}

const motivationalQuotes = [
    "The master has failed more times than the beginner has even tried.",
    "Every mistake is a lesson in disguise. The next victory is closer.",
    "Failure is not the opposite of success; it's part of success.",
    "Persistence can turn failure into extraordinary achievement.",
    "Challenges are what make life interesting; overcoming them is what makes life meaningful."
];

const Confetti: React.FC = () => {
    const confettiRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
        const container = confettiRef.current;
        if (!container) return;

        const confettiCount = 150;
        const colors = ['var(--color-brand-primary)', 'var(--color-brand-secondary)', 'var(--color-brand-accent)', '#EAEAEA'];

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.animationDuration = `${Math.random() * 3 + 3}s`; // 3s to 6s
            confetti.style.animationDelay = `${Math.random() * 4}s`; // 0s to 4s
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            if (Math.random() > 0.2) { // Rectangles
                confetti.style.width = `${Math.random() * 12 + 8}px`;
                confetti.style.height = `${Math.random() * 6 + 5}px`;
            } else { // Squares
                 const size = `${Math.random() * 8 + 8}px`;
                 confetti.style.width = size;
                 confetti.style.height = size;
            }

            const initialRotation = Math.random() * 360;
            confetti.style.setProperty('--initial-rotation', `${initialRotation}deg`);

            container.appendChild(confetti);
        }

        const timeoutId = setTimeout(() => {
            if(container) container.innerHTML = '';
        }, 10000); // Clear confetti after longest animation finishes

        return () => {
            if (container) {
                container.innerHTML = '';
            }
            clearTimeout(timeoutId);
        };
    }, []);
  
    return <div ref={confettiRef} className="absolute top-0 left-0 w-full h-full overflow-hidden z-0"></div>;
};


const EndGameScreen: React.FC<EndGameScreenProps> = ({ winner, loser, onPlayAgain }) => {
    const quote = useRef(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

    return (
        <div className="fixed inset-0 bg-bg-dark/90 backdrop-blur-xl flex flex-col items-center justify-center z-[100] animate-fade-in text-center p-4 overflow-hidden">
            <Confetti />
            
            {/* Winner Display - content must be on a higher z-index than confetti */}
            <div className="relative z-10">
                <TrophyIcon className="w-48 h-48 text-brand-primary animate-trophy-glow" />
            </div>
            <h1 
                className="relative z-10 text-6xl font-bold text-white mt-8 glitch-effect" 
                style={{ animationDelay: '0.5s' }}
                data-text="VICTORY"
            >
                VICTORY
            </h1>
            <p className="relative z-10 text-2xl text-brand-secondary mt-2 animate-fade-in" style={{ animationDelay: '0.8s' }}>
                Congratulations, {winner.name}!
            </p>

            {/* Loser Display & Motivation */}
            <div className="relative z-10 mt-16 animate-motivation-fade-in" style={{ animationDelay: '1.5s' }}>
                <p className="text-xl text-text-secondary italic">"{quote.current}"</p>
                <p className="text-lg text-text-primary mt-4">Great effort, {loser.name}! Keep honing your skills.</p>
            </div>
            
            <button
                onClick={onPlayAgain}
                className="relative z-10 mt-12 font-bold py-3 px-8 rounded-lg transition-all duration-300 bg-brand-primary text-white hover:shadow-[0_0_20px_#00A9A5] hover:scale-105 animate-fade-in"
                style={{ animationDelay: '2s' }}
            >
                Play Again
            </button>
        </div>
    );
};

export default EndGameScreen;
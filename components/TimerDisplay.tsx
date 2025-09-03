import React from 'react';

interface TimerDisplayProps {
  timeLeft: number;
  timeLimit: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, timeLimit }) => {
    const safeTimeLeft = Math.max(0, timeLeft);
    const minutes = Math.floor(safeTimeLeft / 60);
    const seconds = safeTimeLeft % 60;
    const progress = (safeTimeLeft / timeLimit) * 100;

    let progressBarColor = 'bg-brand-primary';
    if (progress < 50) progressBarColor = 'bg-yellow-500';
    if (progress < 25) progressBarColor = 'bg-red-500';
    
    return (
        <div className="w-40 md:w-48 text-center animate-fade-in">
            <span className="text-2xl font-bold font-mono tracking-widest text-text-primary">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </span>
            <div className="w-full bg-border-color/50 rounded-full h-2 mt-1.5 overflow-hidden">
                <div
                    className={`${progressBarColor} h-2 rounded-full transition-all duration-300 ease-linear`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default TimerDisplay;

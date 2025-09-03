import React, { useState } from 'react';
import { PlusCircleIcon, LogInIcon, CopyIcon, CheckIcon, AlertTriangleIcon } from './IconComponents';

interface OnlineLobbyProps {
    roomCode: string | null;
    onCreateRoom: () => void;
    onJoinRoom: (code: string) => void;
}

const OnlineLobby: React.FC<OnlineLobbyProps> = ({ roomCode, onCreateRoom, onJoinRoom }) => {
    const [joinCode, setJoinCode] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const handleJoinSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (joinCode.trim()) {
            onJoinRoom(joinCode.trim().toUpperCase());
        }
    };

    const handleCopyCode = () => {
        if (roomCode) {
            navigator.clipboard.writeText(roomCode)
                .then(() => {
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                });
        }
    };

    if (roomCode) {
        // Waiting screen after creating a room
        return (
            <div className="flex flex-col items-center justify-center h-full animate-fade-in p-4">
                <div className="w-full max-w-md p-8 bg-bg-light/50 backdrop-blur-lg rounded-xl border border-border-color/50 shadow-2xl text-center">
                    <h2 className="text-2xl font-bold text-brand-secondary mb-4">Room Created</h2>
                    <p className="text-text-secondary mb-6">Share this code with your opponent to let them join.</p>
                    <div className="relative p-4 bg-bg-dark/80 border-2 border-dashed border-border-color rounded-lg">
                        <p className="text-4xl font-bold tracking-widest text-text-primary font-mono">{roomCode}</p>
                        <button 
                            onClick={handleCopyCode}
                            className="absolute top-2 right-2 p-2 rounded-md bg-brand-secondary/20 text-brand-secondary hover:bg-brand-secondary/40 transition-colors"
                            title="Copy Code"
                            disabled={isCopied}
                        >
                            {isCopied ? <CheckIcon className="w-5 h-5"/> : <CopyIcon className="w-5 h-5"/>}
                        </button>
                    </div>
                    <div className="flex items-center justify-center mt-8 text-text-secondary">
                        <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                        Waiting for opponent to connect...
                    </div>
                </div>
            </div>
        );
    }

    // Default lobby to create or join
    return (
        <div className="flex flex-col items-center justify-center h-full animate-fade-in p-4">
            <div className="w-full max-w-lg p-8 bg-bg-light/50 backdrop-blur-lg rounded-xl border border-border-color/50 shadow-2xl space-y-8">
                {/* Create Room */}
                <div>
                    <h3 className="text-xl font-bold text-text-primary flex items-center gap-2"><PlusCircleIcon className="text-brand-primary"/> Create a Room</h3>
                    <p className="text-text-secondary text-sm my-2">Start a new duel and invite a friend with a unique code.</p>
                    <button
                        onClick={onCreateRoom}
                        className="w-full font-bold py-3 px-6 rounded-lg transition-all duration-300 bg-brand-primary text-white hover:shadow-[0_0_20px_#00A9A5] hover:scale-105"
                    >
                        Create Room
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-border-color/50" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-bg-light px-2 text-sm text-text-secondary">OR</span>
                    </div>
                </div>

                {/* Join Room */}
                <div>
                    <h3 className="text-xl font-bold text-text-primary flex items-center gap-2"><LogInIcon className="text-brand-secondary"/> Join a Room</h3>
                    <p className="text-text-secondary text-sm my-2">Enter a room code from a friend to start the duel.</p>
                    <form onSubmit={handleJoinSubmit} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            placeholder="Enter Passcode"
                            maxLength={6}
                            className="flex-grow p-3 bg-bg-dark/80 border-2 border-border-color rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors font-mono tracking-widest uppercase"
                            required
                        />
                        <button
                            type="submit"
                            className="font-bold py-3 px-6 rounded-lg transition-all duration-300 bg-brand-secondary text-white hover:bg-brand-primary disabled:opacity-50"
                            disabled={!joinCode.trim()}
                        >
                            Join
                        </button>
                    </form>
                </div>
                
                 <div className="mt-4 p-3 bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-300 text-xs rounded-r-lg flex items-start gap-2">
                    <AlertTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                        <strong>UI/UX Demonstration:</strong> Real-time online connectivity is not implemented. Joining a room will start a simulated match.
                    </span>
                </div>
            </div>
        </div>
    );
};

export default OnlineLobby;

import React, { useState, useCallback, useEffect } from 'react';
import { SkillLevel, AnalysisResult, AppMode, Challenge, ChallengeResult, MultiplayerGameState, Player, MultiplayerMode, OnlineGameState } from './types';
import { analyzeCode, generateChallenge, compareSolutions, validateSolution } from './services/localLLMService';
import useHistory from './hooks/useHistory';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import SkillSelector from './components/SkillSelector';
import AnalysisOutput from './components/AnalysisOutput';
import Loader from './components/Loader';
import ModeSelector from './components/ModeSelector';
import ChallengeResultDisplay from './components/ChallengeResultDisplay';
import MultiplayerSetup from './components/MultiplayerSetup';
import EndGameScreen from './components/EndGameScreen';
import MultiplayerLobby from './components/MultiplayerLobby';
import OnlineLobby from './components/OnlineLobby';
import TimerDisplay from './components/TimerDisplay';
import Scoreboard from './components/Scoreboard';
import { SwordsIcon, SocaLogoIcon, AlertTriangleIcon, BugIcon, PencilIcon, UndoIcon, RedoIcon, LogOutIcon, TrophyIcon } from './components/IconComponents';

const initialCode = `
// Example: A simple React component with some issues
import React, { useState, useEffect } from 'react';

function UserProfile(props) {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  // Bad: useEffect without dependency array
  useEffect(() => {
    fetch('https://api.example.com/users/' + props.userId)
      .then(res => res.json())
      .then(data => setUser(data));
    
    // Inefficient: another fetch in the same effect
    fetch('https://api.example.com/users/' + props.userId + '/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }); // <-- Missing dependency array

  if (!user) {
    return 'Loading profile...';
  }

  // Bad: inline styles and string concatenation
  return (
    <div style={{ padding: "20px", border: "1px solid #ccc" }}>
      <h1>{user.name}'s Profile</h1>
      <p>Email: {user.email}</p>
      
      <h2>Posts:</h2>
      <ul>
        {posts.map(post => {
          // Bad: using index as key
          return <li key={posts.indexOf(post)}>{post.title}</li>
        })}
      </ul>
    </div>
  );
}
`;

const ROUND_TIME_LIMIT = 60; // 60 seconds per round

const initialMultiplayerState: MultiplayerGameState = {
  mode: MultiplayerMode.None,
  onlineState: OnlineGameState.Lobby,
  roomCode: null,
  players: [{ name: 'Player 1', score: 0 }, { name: 'Player 2', score: 0 }],
  targetScore: 5,
  currentChallenge: null,
  roundWinner: null,
  roundStartTime: null,
  gameWinner: null,
  isVerifying: false,
  activePlayerIndex: 0,
};

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.Review);
  const { 
    state: code, 
    setState: setCode, 
    undo: undoCode, 
    redo: redoCode, 
    canUndo: canUndoCode, 
    canRedo: canRedoCode 
  } = useHistory<string>(initialCode);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(SkillLevel.Junior);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for Challenge Mode
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const { 
    state: userSolution, 
    setState: setUserSolution, 
    resetState: resetUserSolution,
    undo: undoSolution, 
    redo: redoSolution, 
    canUndo: canUndoSolution, 
    canRedo: canRedoSolution
  } = useHistory<string>('');
  const [challengeResult, setChallengeResult] = useState<ChallengeResult | null>(null);

  // State for Multiplayer Mode
  const [multiplayerState, setMultiplayerState] = useState<MultiplayerGameState>(initialMultiplayerState);
  const { state: p1Solution, setState: setP1Solution, resetState: resetP1Solution } = useHistory<string>('');
  const { state: p2Solution, setState: setP2Solution, resetState: resetP2Solution } = useHistory<string>('');
  const [roundEndMessage, setRoundEndMessage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_LIMIT);
  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);

  useEffect(() => {
    // Auto-fetch challenge for local duel after setup, or for online duel after joining
    const shouldFetchChallenge = (multiplayerState.mode === MultiplayerMode.Local && !multiplayerState.gameWinner && multiplayerState.targetScore > 0) || 
                                 (multiplayerState.mode === MultiplayerMode.Online && multiplayerState.onlineState === OnlineGameState.Playing);

    if (shouldFetchChallenge && !multiplayerState.currentChallenge && !isLoading) {
      handleGenerateChallenge(true);
    }
  }, [multiplayerState, isLoading]);
  
  // Multiplayer Timer Effect
  useEffect(() => {
    const isMultiplayerRoundActive =
      mode === AppMode.Multiplayer &&
      multiplayerState.mode !== MultiplayerMode.None &&
      (multiplayerState.mode === MultiplayerMode.Local || multiplayerState.onlineState === OnlineGameState.Playing) &&
      !!multiplayerState.roundStartTime &&
      !multiplayerState.gameWinner &&
      !multiplayerState.roundWinner;

    if (!isMultiplayerRoundActive) {
      return;
    }

    const timerId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - multiplayerState.roundStartTime!) / 1000);
      const remaining = ROUND_TIME_LIMIT - elapsed;

      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        setTimeLeft(0);
        clearInterval(timerId);
        handleTimeout();
      }
    }, 500);

    return () => clearInterval(timerId);
  }, [mode, multiplayerState.roundStartTime, multiplayerState.gameWinner, multiplayerState.roundWinner]);


  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    setError(null);
    if (newMode !== AppMode.Multiplayer) {
      setMultiplayerState(initialMultiplayerState);
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) {
      setError("Please enter some code to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeCode(code, skillLevel);
      setAnalysisResult(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [code, skillLevel]);
  
  const handleGenerateChallenge = useCallback(async (isMultiplayer = false) => {
    setIsLoading(true);
    setError(null);
    if (isMultiplayer) {
      setMultiplayerState(s => ({...s, currentChallenge: null}));
    } else {
      setChallenge(null);
      setChallengeResult(null);
      resetUserSolution('');
    }
    
    try {
        const result = await generateChallenge(skillLevel);
        if(isMultiplayer) {
          setMultiplayerState(s => ({...s, currentChallenge: result, roundWinner: null, roundStartTime: Date.now() }));
          setTimeLeft(ROUND_TIME_LIMIT);
          resetP1Solution('');
          resetP2Solution('');
        } else {
          setChallenge(result);
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unexpected error occurred while fetching the challenge.");
        }
    } finally {
        setIsLoading(false);
    }
  }, [skillLevel, resetUserSolution, resetP1Solution, resetP2Solution]);

  const handleSubmitSolution = useCallback(async () => {
    if (!challenge?.buggyCode) return;
    if (!userSolution.trim()) {
        setError("Please provide your solution to the challenge.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setChallengeResult(null);
    try {
        const result = await compareSolutions(challenge.buggyCode, userSolution, skillLevel);
        setChallengeResult(result);
    } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unexpected error occurred during comparison.");
        }
    } finally {
        setIsLoading(false);
    }
  }, [challenge, userSolution, skillLevel]);
  
  // --- Multiplayer Handlers ---
  
  const handleTimeout = () => {
    if (multiplayerState.roundWinner || multiplayerState.gameWinner) return;

    setRoundEndMessage("Time's up! No points awarded for this round.");
    
    setMultiplayerState(s => ({
        ...s,
        roundWinner: null, 
        currentChallenge: null,
        roundStartTime: null,
    }));

    setTimeout(() => {
        setRoundEndMessage(null);
        handleGenerateChallenge(true);
    }, 3000);
  };

  const handleExitMultiplayer = () => {
      setMode(AppMode.Review);
      setMultiplayerState(initialMultiplayerState);
  };

  // Local Duel Handlers
  const handleLocalDuelSetup = (p1Name: string, p2Name: string, targetScore: number) => {
    setMultiplayerState({
      ...initialMultiplayerState,
      mode: MultiplayerMode.Local,
      players: [{ name: p1Name, score: 0 }, { name: p2Name, score: 0 }],
      targetScore: targetScore
    });
  };
  
  // Online Duel Handlers
  const handleCreateRoom = () => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setMultiplayerState(s => ({
      ...s,
      mode: MultiplayerMode.Online,
      onlineState: OnlineGameState.Waiting,
      roomCode: roomCode,
    }));
  };

  const handleJoinRoom = (code: string) => {
    // In a real app, you'd validate the code here. We'll just simulate success.
    setMultiplayerState(s => ({
      ...s,
      mode: MultiplayerMode.Online,
      onlineState: OnlineGameState.Playing,
      roomCode: code,
      players: [{ name: "You", score: 0 }, { name: "Opponent", score: 0 }], // Generic names for online
      targetScore: 5 // Default score for online
    }));
  };

  const handlePlayerSubmit = async (playerIndex: 0 | 1, solution: string) => {
    if(!multiplayerState.currentChallenge?.buggyCode || !solution.trim()) return;

    setMultiplayerState(s => ({...s, isVerifying: true}));
    try {
      const result = await validateSolution(multiplayerState.currentChallenge.buggyCode, solution);
      if(result.isCorrect) {
        const winner = multiplayerState.players[playerIndex];
        const newScore = winner.score + 1;
        const updatedPlayers: [Player, Player] = [
          multiplayerState.players[0], 
          multiplayerState.players[1]
        ];
        updatedPlayers[playerIndex] = { ...winner, score: newScore };

        setRoundEndMessage(`${winner.name} wins the round!`);

        if(newScore >= multiplayerState.targetScore) {
          // Game Over
          setMultiplayerState(s => ({...s, players: updatedPlayers, gameWinner: winner, roundWinner: null, roundStartTime: null}));
        } else {
          // Next Round
          setMultiplayerState(s => ({...s, players: updatedPlayers, roundWinner: winner, currentChallenge: null, roundStartTime: null}));
          setTimeout(() => {
            setRoundEndMessage(null);
            handleGenerateChallenge(true);
          }, 3000);
        }
      } else {
        setRoundEndMessage(result.feedback);
        setTimeout(() => setRoundEndMessage(null), 3000);
      }
    } catch (err) {
      setError("Failed to validate solution. Please try again.");
    } finally {
      setMultiplayerState(s => ({...s, isVerifying: false}));
    }
  };

  const handlePlayAgain = () => {
    setMultiplayerState(prevState => {
        // Reset scores but keep player names and settings
        const playersWithResetScores: [Player, Player] = [
            { ...prevState.players[0], score: 0 },
            { ...prevState.players[1], score: 0 },
        ];

        return {
            ...prevState, // Keep mode, targetScore, etc.
            players: playersWithResetScores,
            currentChallenge: null,
            roundWinner: null,
            roundStartTime: null,
            gameWinner: null,
            isVerifying: false,
            activePlayerIndex: 0,
        };
    });
  };
  
  const renderActionButton = () => {
    const commonButtonClasses = "w-full sm:w-auto font-bold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 relative overflow-hidden bg-brand-primary text-white hover:shadow-[0_0_20px_#00A9A5] hover:scale-105";

    if (mode === AppMode.Review) {
      return (
        <button onClick={handleAnalyze} disabled={isLoading} className={commonButtonClasses}>
          {isLoading ? ( <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Analyzing...</span></> ) : ( <span>Analyze Code</span> )}
        </button>
      );
    }

    if (mode === AppMode.Challenge) {
      const text = challenge ? 'Submit & Compare' : 'Generate New Challenge';
      const action = challenge ? handleSubmitSolution : () => handleGenerateChallenge(false);
      return (
        <button onClick={action} disabled={isLoading} className={commonButtonClasses}>
          {isLoading ? ( <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div><span>Thinking...</span></> ) : ( <><SwordsIcon className="w-5 h-5" /><span>{text}</span></>)}
        </button>
      )
    }
  };
  
  const renderUndoRedoControls = (undo: () => void, redo: () => void, canUndo: boolean, canRedo: boolean) => (
      <div className="flex items-center gap-2">
        <button onClick={undo} disabled={!canUndo} className="p-1.5 rounded-md text-text-secondary hover:bg-border-color hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors" title="Undo"><UndoIcon className="w-5 h-5" /></button>
        <button onClick={redo} disabled={!canRedo} className="p-1.5 rounded-md text-text-secondary hover:bg-border-color hover:text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors" title="Redo"><RedoIcon className="w-5 h-5" /></button>
      </div>
  );

  if (mode === AppMode.Multiplayer) {
    const multiplayerContent = () => {
      if (multiplayerState.gameWinner) {
        const loser = multiplayerState.players.find(p => p.name !== multiplayerState.gameWinner?.name);
        return <EndGameScreen winner={multiplayerState.gameWinner} loser={loser!} onPlayAgain={handlePlayAgain} />;
      }

      const ExitButton = () => (
        <button 
          onClick={handleExitMultiplayer} 
          className="exit-multiplayer-btn flex items-center gap-2 p-2 rounded-full bg-bg-light/80 backdrop-blur-md text-text-secondary hover:text-text-primary hover:bg-border-color/50 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-colors duration-300"
          title="Exit Multiplayer"
        >
          <LogOutIcon className="w-5 h-5" />
        </button>
      );
      
      switch(multiplayerState.mode) {
        case MultiplayerMode.None:
          return (
            <main className="flex-grow flex flex-col p-4 animate-fade-in">
              <ExitButton />
              <MultiplayerLobby 
                onSelectLocal={() => setMultiplayerState(s => ({ ...s, mode: MultiplayerMode.Local, targetScore: 0}))}
                onSelectOnline={() => setMultiplayerState(s => ({ ...s, mode: MultiplayerMode.Online }))}
              />
            </main>
          );
        
        case MultiplayerMode.Local:
          if (multiplayerState.targetScore === 0) { // Using targetScore to check if setup is done
            return <main className="flex-grow flex flex-col p-4 gap-4 animate-fade-in"><ExitButton /><MultiplayerSetup onSetupComplete={handleLocalDuelSetup} /></main>;
          }
          // Local Duel Game Screen
          return (
            <main className="flex-grow flex flex-col p-4 gap-4 animate-fade-in">
              <Scoreboard 
                isOpen={isScoreboardOpen}
                onClose={() => setIsScoreboardOpen(false)}
                players={multiplayerState.players}
                targetScore={multiplayerState.targetScore}
              />
              <ExitButton />
              <div className="relative flex-shrink-0 flex justify-center items-center gap-4 p-4 bg-bg-light/50 backdrop-blur-lg rounded-lg border border-border-color/50 animate-slide-in-up">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <button
                        onClick={() => setIsScoreboardOpen(true)}
                        className="flex items-center gap-2 py-2 px-4 rounded-lg bg-bg-dark/80 border border-border-color text-text-secondary hover:text-text-primary hover:border-brand-primary transition-colors"
                        title="View Scoreboard"
                    >
                        <TrophyIcon className="w-5 h-5 text-brand-secondary" />
                        <span className="hidden md:inline">Scoreboard</span>
                    </button>
                </div>
                <div className="text-center">
                    {multiplayerState.roundStartTime && !multiplayerState.roundWinner && !multiplayerState.gameWinner ? (
                      <TimerDisplay timeLeft={timeLeft} timeLimit={ROUND_TIME_LIMIT} />
                    ) : (
                      <h2 className="text-xl font-bold text-text-primary">First to {multiplayerState.targetScore} wins!</h2>
                    )}
                    {roundEndMessage && <p className="text-sm text-brand-accent absolute bottom-[-25px] left-1/2 -translate-x-1/2 w-full text-center animate-fade-in">{roundEndMessage}</p>}
                </div>
              </div>
              
              <div className="flex-grow flex flex-col gap-4 min-h-0">
                {isLoading && !multiplayerState.currentChallenge ? <div className="h-full flex-grow"><Loader /></div> : multiplayerState.currentChallenge ? (
                  <>
                  <div className="flex-shrink-0 bg-bg-dark/30 border-l-4 border-yellow-400 rounded-r-lg p-4 space-y-2 shadow-lg backdrop-blur-sm animate-fade-in">
                      <div className="flex items-center gap-3"><BugIcon className="w-6 h-6 text-yellow-400" /><h3 className="text-lg font-bold text-yellow-400">Round Challenge</h3></div>
                      <p className="text-text-secondary text-sm pl-9">{multiplayerState.currentChallenge.description}</p>
                  </div>
                  <div className="flex-grow multiplayer-grid min-h-0">
                    <div className="p-0.5 bg-gradient-to-br from-brand-primary/50 to-brand-accent/50 rounded-lg"><div className="bg-bg-light/50 backdrop-blur-lg rounded-md h-full w-full p-4 flex flex-col gap-2 overflow-y-auto">
                        <label className="text-lg font-bold text-text-primary">{multiplayerState.players[0].name}'s Solution</label>
                        <div className="flex-grow"><CodeInput code={p1Solution} setCode={setP1Solution} /></div>
                        <button onClick={() => handlePlayerSubmit(0, p1Solution)} disabled={multiplayerState.isVerifying || !!multiplayerState.roundWinner} className="w-full font-bold py-2 px-4 rounded-lg transition-all duration-300 bg-brand-secondary text-white hover:bg-brand-primary disabled:opacity-50 disabled:cursor-not-allowed">Submit</button>
                    </div></div>
                    <div className="p-0.5 bg-gradient-to-br from-brand-primary/50 to-brand-accent/50 rounded-lg"><div className="bg-bg-light/50 backdrop-blur-lg rounded-md h-full w-full p-4 flex flex-col gap-2 overflow-y-auto">
                        <label className="text-lg font-bold text-text-primary">{multiplayerState.players[1].name}'s Solution</label>
                        <div className="flex-grow"><CodeInput code={p2Solution} setCode={setP2Solution} /></div>
                        <button onClick={() => handlePlayerSubmit(1, p2Solution)} disabled={multiplayerState.isVerifying || !!multiplayerState.roundWinner} className="w-full font-bold py-2 px-4 rounded-lg transition-all duration-300 bg-brand-secondary text-white hover:bg-brand-primary disabled:opacity-50 disabled:cursor-not-allowed">Submit</button>
                    </div></div>
                  </div>
                  </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary p-8">
                        <SocaLogoIcon className="w-20 h-20 mb-4 opacity-20" />
                        <h2 className="text-2xl font-bold text-text-primary">Something went wrong.</h2>
                        <button onClick={() => handleGenerateChallenge(true)} className="mt-4 font-bold py-2 px-4 rounded-lg bg-brand-primary">Try loading again</button>
                    </div>
                )}
              </div>
            </main>
          );

        case MultiplayerMode.Online:
          switch(multiplayerState.onlineState) {
            case OnlineGameState.Lobby:
            case OnlineGameState.Waiting:
              return <main className="flex-grow flex flex-col p-4 gap-4 animate-fade-in"><ExitButton /><OnlineLobby roomCode={multiplayerState.roomCode} onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} /></main>;
            
            case OnlineGameState.Playing:
               // Simulated online game screen
              return (
                 <main className="flex-grow flex flex-col p-4 gap-4 animate-fade-in">
                    <Scoreboard 
                        isOpen={isScoreboardOpen}
                        onClose={() => setIsScoreboardOpen(false)}
                        players={multiplayerState.players}
                        targetScore={multiplayerState.targetScore}
                    />
                    <ExitButton />
                    <div className="relative flex-shrink-0 flex justify-center items-center gap-4 p-4 bg-bg-light/50 backdrop-blur-lg rounded-lg border border-border-color/50 animate-slide-in-up">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            <button
                                onClick={() => setIsScoreboardOpen(true)}
                                className="flex items-center gap-2 py-2 px-4 rounded-lg bg-bg-dark/80 border border-border-color text-text-secondary hover:text-text-primary hover:border-brand-primary transition-colors"
                                title="View Scoreboard"
                            >
                                <TrophyIcon className="w-5 h-5 text-brand-secondary" />
                                <span className="hidden md:inline">Scoreboard</span>
                            </button>
                        </div>
                        <div className="text-center">
                            {multiplayerState.roundStartTime && !multiplayerState.roundWinner && !multiplayerState.gameWinner ? (
                                <TimerDisplay timeLeft={timeLeft} timeLimit={ROUND_TIME_LIMIT} />
                            ) : (
                                <h2 className="text-xl font-bold text-text-primary">Online Duel</h2>
                            )}
                            {roundEndMessage && <p className="text-sm text-brand-accent">{roundEndMessage}</p>}
                        </div>
                    </div>
                     {isLoading && !multiplayerState.currentChallenge ? <div className="h-full flex-grow"><Loader /></div> : multiplayerState.currentChallenge ? (
                      <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
                          {/* Player's view */}
                          <div className="p-0.5 bg-gradient-to-br from-brand-primary/50 to-brand-accent/50 rounded-lg"><div className="bg-bg-light/50 backdrop-blur-lg rounded-md h-full w-full p-4 flex flex-col gap-2 overflow-y-auto">
                              <h3 className="text-lg font-bold text-text-primary">Your Challenge</h3>
                              <p className="text-text-secondary text-sm">{multiplayerState.currentChallenge.description}</p>
                              <pre className="mt-2 p-2 bg-code-bg/80 border border-code-border rounded-md text-sm"><code className="font-mono text-text-primary">{multiplayerState.currentChallenge.buggyCode}</code></pre>
                              <div className="flex-grow mt-4"><CodeInput code={p1Solution} setCode={setP1Solution} placeholder="Enter your solution..." /></div>
                              <button disabled={multiplayerState.isVerifying} className="w-full font-bold py-2 px-4 rounded-lg transition-all duration-300 bg-brand-secondary text-white hover:bg-brand-primary disabled:opacity-50">Submit Solution</button>
                          </div></div>
                          {/* Opponent's placeholder view */}
                          <div className="p-0.5 bg-gradient-to-br from-brand-accent/50 to-brand-primary/50 rounded-lg"><div className="bg-bg-light/50 backdrop-blur-lg rounded-md h-full w-full p-4 flex flex-col gap-2 items-center justify-center text-center">
                            <SocaLogoIcon className="w-16 h-16 opacity-30 animate-pulse"/>
                            <h3 className="text-lg font-bold text-text-primary mt-4">Waiting for Opponent...</h3>
                            <p className="text-text-secondary text-sm">In a real match, you'd see your opponent's progress here.</p>
                          </div></div>
                      </div>
                    ) : <div className="h-full flex-grow"><p>Error loading challenge.</p></div>}
                 </main>
              );
          }
      }
    };
    
    return (
      <div className="min-h-screen flex flex-col bg-transparent text-text-primary">
        <Header onLogoClick={() => handleModeChange(AppMode.Review)} />
        {multiplayerContent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-text-primary">
      <Header onLogoClick={() => handleModeChange(AppMode.Review)} />
      <main className="flex-grow flex flex-col p-4 gap-4 animate-fade-in">
        {/* Controls Bar */}
        <div 
          className="flex-shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-bg-light/50 backdrop-blur-lg rounded-lg border border-border-color/50 animate-slide-in-up"
          style={{ animationDelay: '200ms' }}
        >
          <div className="flex items-center gap-x-8 gap-y-4 flex-wrap">
            <ModeSelector selectedMode={mode} onSelectMode={handleModeChange} />
            <SkillSelector selectedLevel={skillLevel} onSelectLevel={setSkillLevel} />
          </div>
          {renderActionButton()}
        </div>

        {/* Content Panels */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
          {/* Left Panel */}
          <div 
            className="p-0.5 bg-gradient-to-br from-brand-primary/50 to-brand-accent/50 rounded-lg animate-slide-in-up"
            style={{ animationDelay: '400ms' }}
          >
            <div className="bg-bg-light/50 backdrop-blur-lg rounded-md h-full w-full p-4 flex flex-col gap-2 overflow-y-auto">
            {mode === AppMode.Review ? (
              <>
                <div className="flex-shrink-0 flex justify-between items-center">
                    <label className="text-lg font-bold text-text-primary">Your Code</label>
                    {renderUndoRedoControls(undoCode, redoCode, canUndoCode, canRedoCode)}
                </div>
                <div className="flex-grow">
                    <CodeInput 
                        code={code} 
                        setCode={setCode} 
                        placeholder="Paste your code here for analysis..."
                    />
                </div>
              </>
            ) : (
              challenge ? (
                <>
                  <div className="flex-shrink-0 bg-bg-dark/30 border-l-4 border-yellow-400 rounded-r-lg p-4 space-y-2 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <BugIcon className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                        <h3 className="text-lg font-bold text-yellow-400">The Challenge</h3>
                    </div>
                    <p className="text-text-secondary text-sm pl-9">{challenge.description}</p>
                    <pre className="mt-2 p-3 bg-code-bg/80 border border-code-border rounded-md text-sm overflow-x-auto ml-9">
                        <code className="font-mono text-text-primary whitespace-pre-wrap">{challenge.buggyCode}</code>
                    </pre>
                  </div>
                  <div className="flex-grow flex flex-col min-h-[250px] bg-bg-dark/30 border-l-4 border-brand-secondary rounded-r-lg p-4 shadow-lg backdrop-blur-sm gap-2">
                     <div className="flex justify-between items-center">
                        <label htmlFor="solutionInput" className="flex items-center gap-3 text-lg font-bold text-brand-secondary">
                            <PencilIcon className="w-6 h-6 text-brand-secondary flex-shrink-0" />
                            <span>Your Solution</span>
                        </label>
                        {renderUndoRedoControls(undoSolution, redoSolution, canUndoSolution, canRedoSolution)}
                     </div>
                     <div className="flex-grow pl-9">
                        <CodeInput id="solutionInput" code={userSolution} setCode={setUserSolution} placeholder="Enter your fixed code here..." />
                     </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
                  <SwordsIcon className="w-16 h-16 mb-4 opacity-50 text-brand-secondary" />
                  <h2 className="text-2xl font-bold text-text-primary">Ready for a Challenge?</h2>
                  <p className="mt-2">Click "Generate New Challenge" to get started.</p>
                </div>
              )
            )}
            </div>
          </div>

          {/* Right Panel */}
          <div 
            className="p-0.5 bg-gradient-to-br from-brand-primary/50 to-brand-accent/50 rounded-lg animate-slide-in-up"
            style={{ animationDelay: '600ms' }}
          >
            <div className="bg-bg-light/50 backdrop-blur-lg rounded-md h-full w-full overflow-hidden">
                {isLoading ? (
                <Loader />
                ) : error ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-red-400 p-4 bg-red-900/20">
                    <AlertTriangleIcon className="w-16 h-16 mb-4" />
                    <h2 className="text-xl font-bold">Operation Failed</h2>
                    <p className="mt-2">{error}</p>
                </div>
                ) : (
                mode === AppMode.Review ? (
                    <AnalysisOutput result={analysisResult} />
                ) : (
                    challengeResult ? (
                    <ChallengeResultDisplay userSolution={userSolution} result={challengeResult} />
                    ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary p-8">
                        <SocaLogoIcon className="w-20 h-20 mb-4 opacity-20" />
                        <h2 className="text-2xl font-bold text-text-primary">Awaiting Submission</h2>
                        <p className="mt-2 max-w-md">
                            Once you submit your solution, your results and SOCA's feedback will appear here.
                        </p>
                    </div>
                    )
                )
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
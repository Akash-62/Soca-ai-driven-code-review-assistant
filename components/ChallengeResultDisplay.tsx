import React from 'react';
import { ChallengeResult } from '../types';
import { CopyIcon, CheckIcon } from './IconComponents';

const CodeBlock: React.FC<{ title: string; code: string }> = ({ title, code }) => {
  const [isCopied, setIsCopied] = React.useState(false);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy code: ', err);
          alert('Failed to copy code to clipboard.');
        });
    }
  };

  return (
    <div className="bg-bg-light/40 rounded-lg border border-border-color/50 overflow-hidden h-full flex flex-col backdrop-blur-md">
        <div className="flex justify-between items-center p-3 bg-border-color/30 flex-shrink-0">
            <h3 className="font-semibold text-text-primary">{title}</h3>
            <button
                onClick={handleCopy}
                className="bg-brand-secondary hover:bg-brand-primary text-white font-bold py-1 px-3 rounded-lg text-sm transition-all duration-300 flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed hover:shadow-[0_0_10px_#4ECCA3]"
                disabled={isCopied}
                aria-label={`Copy ${title}`}
            >
                {isCopied ? (
                    <>
                        <CheckIcon className="w-4 h-4" />
                        <span>Copied</span>
                    </>
                ) : (
                    <>
                        <CopyIcon className="w-4 h-4" />
                        <span>Copy</span>
                    </>
                )}
            </button>
        </div>
        <div className="p-4 text-sm overflow-auto flex-grow bg-code-bg/80">
            <pre>
                <code className="font-mono text-text-primary whitespace-pre-wrap">
                    {code}
                </code>
            </pre>
        </div>
    </div>
  );
};


interface ChallengeResultDisplayProps {
  userSolution: string;
  result: ChallengeResult;
}

const ChallengeResultDisplay: React.FC<ChallengeResultDisplayProps> = ({ userSolution, result }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b-2 border-border-color/50">
        <h2 className="text-xl font-bold text-text-primary">Challenge Result</h2>
      </div>
      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[40vh] min-h-[300px]">
            <CodeBlock title="Your Solution" code={userSolution} />
            <CodeBlock title="SOCA's Optimal Solution" code={result.aiSolution} />
        </div>
        <div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Feedback on Your Solution</h3>
            <div className="p-4 bg-bg-light/40 rounded-lg border border-border-color/50 text-text-secondary text-sm space-y-2 backdrop-blur-md">
                {result.feedback?.split('\n').map((line, i) => <p key={i}>{line}</p>)}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeResultDisplay;
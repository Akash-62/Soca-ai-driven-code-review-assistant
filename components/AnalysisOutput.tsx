import React, { useState } from 'react';
import { AnalysisResult, AnalysisSection } from '../types';
import { SocaLogoIcon, BugIcon, AlertTriangleIcon, ZapIcon, CheckCircleIcon, CopyIcon, CheckIcon } from './IconComponents';

interface AnalysisOutputProps {
  result: AnalysisResult | null;
}

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; items: AnalysisSection[]; accentColor: string }> = ({ title, icon, items, accentColor }) => {
  return (
    <div className="mb-6 bg-bg-light/40 rounded-lg overflow-hidden border border-border-color/50 backdrop-blur-md transition-all duration-300 hover:border-brand-primary/50 hover:shadow-lg">
      <h3 className={`flex items-center p-3 text-lg font-bold text-text-primary bg-border-color/30 border-l-4 ${accentColor}`}>
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <div className="p-4">
        {(!items || items.length === 0) ? (
          <p className="text-text-secondary italic">No {title.toLowerCase()} found.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="border-b border-border-color/50 last:border-b-0 pb-3 last:pb-0">
                <h4 className="font-semibold text-brand-secondary">{item.title}</h4>
                <p className="text-text-secondary mt-1 text-sm">{item.explanation}</p>
                {item.codeSnippet && (
                  <pre className="mt-2 p-2 bg-code-bg/80 border border-code-border rounded-md text-sm">
                    <code className="font-mono text-text-primary">{item.codeSnippet}</code>
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AnalysisOutput: React.FC<AnalysisOutputProps> = ({ result }) => {
  const [showRewrittenCode, setShowRewrittenCode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Add this console.log to see the exact data being received
  console.log("Analysis Result Received:", result);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary p-8">
        <SocaLogoIcon className="w-20 h-20 mb-4 opacity-20" />
        <h2 className="text-2xl font-bold text-text-primary">Awaiting Analysis</h2>
        <p className="mt-2 max-w-md">
          Paste your code on the left, select your skill level, and click "Analyze Code" to let SOCA work its magic.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    if (result?.rewrittenCode) {
      navigator.clipboard.writeText(result.rewrittenCode)
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
  
  if (showRewrittenCode) {
    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0 p-4 border-b-2 border-border-color/50 flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-primary">Rewritten Code</h2>
                <div className="flex items-center gap-2">
                   <button
                    onClick={handleCopy}
                    className="bg-brand-secondary hover:bg-brand-primary text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                    disabled={isCopied}
                  >
                    {isCopied ? (
                      <>
                        <CheckIcon className="w-5 h-5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <CopyIcon className="w-5 h-5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                  <button
                      onClick={() => setShowRewrittenCode(false)}
                      className="bg-border-color hover:bg-bg-dark text-text-primary font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                      Back to Analysis
                  </button>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto p-4 bg-code-bg/80">
                <pre className="h-full">
                    <code className="font-mono text-text-primary text-sm whitespace-pre-wrap">
                        {result.rewrittenCode}
                    </code>
                </pre>
            </div>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 p-4 border-b-2 border-border-color/50 flex justify-between items-center">
        <h2 className="text-xl font-bold text-text-primary">Analysis Report</h2>
        <button
          onClick={() => setShowRewrittenCode(true)}
          className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-[0_0_15px_#00A9A5] hover:scale-105"
        >
          View Rewritten Code
        </button>
      </div>
      <div className="flex-grow overflow-y-auto p-6">
        <SectionCard title="Errors" icon={<BugIcon />} items={result.errors} accentColor="border-red-500" />
        <SectionCard title="Warnings" icon={<AlertTriangleIcon />} items={result.warnings} accentColor="border-yellow-500" />
        <SectionCard title="Optimizations" icon={<ZapIcon />} items={result.optimizations} accentColor="border-blue-500" />
        <SectionCard title="Best Practices" icon={<CheckCircleIcon />} items={result.bestPractices} accentColor="border-green-500" />
      </div>
    </div>
  );
};

export default AnalysisOutput;
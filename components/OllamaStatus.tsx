import React, { useState, useEffect } from 'react';
import { checkOllamaHealth, HealthCheckResult } from '../services/ollamaHealth';

const OllamaStatus: React.FC = () => {
  const [health, setHealth] = useState<HealthCheckResult | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      setIsChecking(true);
      const result = await checkOllamaHealth();
      setHealth(result);
      setIsChecking(false);
    };

    check();
    // Re-check every 30 seconds
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isChecking && !health) {
    return (
      <div className="fixed bottom-4 right-4 bg-bg-light/90 backdrop-blur-md border border-border-color/50 rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span>Checking Ollama...</span>
        </div>
      </div>
    );
  }

  if (!health) return null;

  const statusColor = health.isHealthy ? 'bg-green-500' : 'bg-red-500';
  const statusText = health.isHealthy 
    ? `✓ Ollama Ready (${health.installedModels.length} models)` 
    : '✗ Ollama Issue';

  return (
    <div className="fixed bottom-4 right-4 bg-bg-light/90 backdrop-blur-md border border-border-color/50 rounded-lg p-3 shadow-lg max-w-sm">
      <div className="flex items-center gap-2 text-sm">
        <div className={`w-2 h-2 ${statusColor} rounded-full ${!health.isHealthy && 'animate-pulse'}`}></div>
        <span className="font-medium text-text-primary">{statusText}</span>
      </div>
      
      {!health.isHealthy && health.suggestions.length > 0 && (
        <div className="mt-2 text-xs text-text-secondary">
          <div className="font-semibold mb-1">Quick Fix:</div>
          {health.suggestions.map((suggestion, idx) => (
            <div key={idx} className="pl-2">• {suggestion}</div>
          ))}
        </div>
      )}

      {health.isHealthy && health.installedModels.length > 0 && (
        <div className="mt-1 text-xs text-text-secondary">
          Models: {health.installedModels.slice(0, 2).join(', ')}
          {health.installedModels.length > 2 && ` +${health.installedModels.length - 2}`}
        </div>
      )}
    </div>
  );
};

export default OllamaStatus;

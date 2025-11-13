// Ollama health check and diagnostics utility

export interface HealthCheckResult {
  isHealthy: boolean;
  ollamaRunning: boolean;
  modelInstalled: boolean;
  installedModels: string[];
  error?: string;
  suggestions: string[];
}

export const checkOllamaHealth = async (): Promise<HealthCheckResult> => {
  const result: HealthCheckResult = {
    isHealthy: false,
    ollamaRunning: false,
    modelInstalled: false,
    installedModels: [],
    suggestions: [],
  };

  try {
    // Check if Ollama is running
    const healthResponse = await fetch('http://localhost:11434');
    result.ollamaRunning = healthResponse.ok;

    if (!result.ollamaRunning) {
      result.suggestions.push('Start Ollama service');
      return result;
    }

    // Check installed models
    const modelsResponse = await fetch('http://localhost:11434/api/tags');
    const modelsData = await modelsResponse.json();
    result.installedModels = modelsData.models?.map((m: any) => m.name) || [];

    // Check if recommended models are installed
    const recommendedModels = ['llama3.2:3b', 'qwen2.5-coder:7b', 'deepseek-coder:6.7b'];
    result.modelInstalled = result.installedModels.some(model => 
      recommendedModels.some(rec => model.includes(rec))
    );

    if (!result.modelInstalled && result.installedModels.length === 0) {
      result.suggestions.push('Download a model: ollama pull llama3.2:3b');
    }

    if (result.ollamaRunning && result.modelInstalled) {
      result.isHealthy = true;
    }

  } catch (error) {
    result.error = error instanceof Error ? error.message : 'Unknown error';
    result.suggestions.push('Install Ollama from https://ollama.com');
    result.suggestions.push('Make sure Ollama service is running');
  }

  return result;
};

export const getModelInfo = async (modelName: string) => {
  try {
    const response = await fetch('http://localhost:11434/api/show', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName }),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to get model info:', error);
  }
  return null;
};

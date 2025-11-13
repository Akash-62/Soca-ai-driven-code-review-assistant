# Local LLM Setup Guide for SOCA

This guide will help you set up a local LLM to replace the Gemini API.

## Why Local LLMs?

✅ **No API keys needed** - Run everything locally  
✅ **Privacy** - Your code never leaves your machine  
✅ **Cost-effective** - No usage fees  
✅ **Fast** - Direct communication with local model  
✅ **Offline-capable** - Works without internet

## Prerequisites

- **RAM**: 8GB minimum (16GB recommended for 7B models)
- **Storage**: 5-10GB for model files
- **OS**: Windows, macOS, or Linux

## Step 1: Install Ollama

### Windows
```powershell
# Download and run the installer from:
# https://ollama.com/download/windows

# Or use winget:
winget install Ollama.Ollama
```

### macOS
```bash
# Download from https://ollama.com/download/mac
# Or use Homebrew:
brew install ollama
```

### Linux
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

## Step 2: Start Ollama Service

```bash
# Start the Ollama server (runs on port 11434)
ollama serve
```

Leave this terminal open. Ollama will run in the background.

## Step 3: Download a Model

Open a **new terminal** and run:

### Recommended Models (pick one):

#### 🏆 Qwen 2.5 Coder 7B (Best for code, default in SOCA)
```bash
ollama pull qwen2.5-coder:7b
```
- **Size**: ~4.7GB
- **RAM**: 8GB minimum
- **Best for**: Code review, debugging, optimization
- **Speed**: Fast

#### ⚡ Llama 3.2 3B (Faster, smaller)
```bash
ollama pull llama3.2:3b
```
- **Size**: ~2GB
- **RAM**: 4GB minimum
- **Best for**: Quick reviews, simple tasks
- **Speed**: Very fast

#### 🔥 DeepSeek Coder 6.7B (Code specialist)
```bash
ollama pull deepseek-coder:6.7b
```
- **Size**: ~3.8GB
- **RAM**: 8GB minimum
- **Best for**: Code generation, refactoring
- **Speed**: Fast

#### 🚀 CodeLlama 7B (Meta's code model)
```bash
ollama pull codellama:7b
```
- **Size**: ~3.8GB
- **RAM**: 8GB minimum
- **Best for**: Multi-language code tasks
- **Speed**: Fast

## Step 4: Configure SOCA

The default model is set to `qwen2.5-coder:7b`. If you want to use a different model:

1. Open `services/localLLMService.ts`
2. Change line 5:
```typescript
const MODEL_NAME = 'llama3.2:3b'; // Change to your preferred model
```

## Step 5: Run SOCA

```bash
npm install
npm run dev
```

Open http://localhost:5173 and start analyzing code!

## Troubleshooting

### "Failed to get response from local LLM"
- ✅ Make sure Ollama is running: `ollama serve`
- ✅ Verify the model is installed: `ollama list`
- ✅ Check Ollama is accessible: `curl http://localhost:11434`

### Slow responses
- Use a smaller model (llama3.2:3b)
- Close other applications to free RAM
- Consider upgrading RAM

### Model not found
```bash
# List installed models
ollama list

# Pull the model if missing
ollama pull qwen2.5-coder:7b
```

### Port conflict (11434 already in use)
```bash
# Stop Ollama
pkill ollama

# Restart
ollama serve
```

## Model Comparison

| Model | Size | RAM | Speed | Code Quality | Best For |
|-------|------|-----|-------|--------------|----------|
| Qwen 2.5 Coder 7B | 4.7GB | 8GB | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | Production code review |
| Llama 3.2 3B | 2GB | 4GB | ⚡⚡⚡⚡⚡ | ⭐⭐⭐ | Quick feedback |
| DeepSeek Coder 6.7B | 3.8GB | 8GB | ⚡⚡⚡⚡ | ⭐⭐⭐⭐ | Refactoring |
| CodeLlama 7B | 3.8GB | 8GB | ⚡⚡⚡ | ⭐⭐⭐⭐ | Multi-language |

## Advanced: GPU Acceleration

If you have an NVIDIA GPU, Ollama will automatically use it for faster inference.

Verify GPU usage:
```bash
nvidia-smi
```

You should see `ollama_llama_server` using VRAM when generating responses.

## Advanced: Custom Models

You can use any model from https://ollama.com/library

```bash
# Example: Use a quantized model for faster performance
ollama pull qwen2.5-coder:7b-q4_K_M
```

Update `MODEL_NAME` in `localLLMService.ts` accordingly.

## Switching Back to Gemini (Cloud)

If you want to use the cloud API again:

1. Rename `services/geminiService.ts.backup` to `services/geminiService.ts`
2. Update `App.tsx` import back to `geminiService`
3. Add `VITE_API_KEY` to `.env.local`
4. Run `npm install @google/generative-ai`

## Resources

- Ollama Documentation: https://github.com/ollama/ollama
- Model Library: https://ollama.com/library
- Ollama Discord: https://discord.gg/ollama

---

**Need help?** Open an issue on GitHub or check Ollama's troubleshooting guide.

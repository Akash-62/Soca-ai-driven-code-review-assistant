<div align="center">
   <h1>⚡ SOCA – Smart Optimized Code Auditor</h1>
   <p><strong>AI‑driven, gamified code review & challenge arena powered by Gemini.</strong></p>
   <p>
      <a href="https://vercel.com/" target="_blank"><img alt="Deploy" src="https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel" /></a>
      <img alt="Vite" src="https://img.shields.io/badge/Vite-6+-646CFF?logo=vite&logoColor=white" />
      <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react" />
      <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" />
   </p>
</div>

## 🚀 Overview
SOCA is an AI‑assisted code review and competitive debugging playground powered by **local open-source LLMs**. Paste code to get structured AI feedback, generate repair challenges, or battle in multiplayer / duel modes. Designed for learning, rapid iteration, and a bit of fun — **all running privately on your machine, no API keys needed**.

## ✨ Features
| Area | Description |
|------|-------------|
| AI Code Review | Analyze pasted code for errors, warnings, optimizations, best practices. |
| Rewritten Code | View an auto‑improved version of your code. |
| Challenge Mode | Generates a buggy snippet you must fix; compares your solution. |
| Multiplayer (Local / Simulated Online) | Compete solving challenges, track scores, timers, round winners. |
| Theming | Light / dark adaptive theme (with subtle light‑theme particle pattern). |
| Undo / Redo | History for both original and challenge solutions. |
| Responsive UI | Mobile‑first adjustments for all layouts. |

## 🧱 Tech Stack
- React 19 + TypeScript
- Vite build tool
- Tailwind CDN (inline config) + custom CSS enhancements
- **Ollama + Local LLMs** (Qwen 2.5 Coder 7B, Llama 3.2, DeepSeek Coder)
- Deployed on Vercel (frontend only; LLM runs locally)

## ⚙️ Prerequisites
- Node.js 18+ (recommended LTS)
- **Ollama** (for running local LLMs)
- 8GB RAM minimum (16GB recommended for 7B models)

## 🔐 Environment Variables
**No API keys required!** SOCA now uses local LLMs via Ollama.

The old `.env.local` file is no longer needed. You can delete it or keep it for backup if you want to switch back to cloud APIs later.

### Optional: Switch Models
Edit `services/localLLMService.ts` line 5 to change the model:
```typescript
const MODEL_NAME = 'qwen2.5-coder:7b'; // Default
// Or: 'llama3.2:3b', 'deepseek-coder:6.7b', 'codellama:7b'
```

## 🛠️ Local Development

### Step 1: Install Ollama
```bash
# Windows (using winget):
winget install Ollama.Ollama

# macOS:
brew install ollama

# Linux:
curl -fsSL https://ollama.com/install.sh | sh
```

Or download from: https://ollama.com/download

### Step 2: Start Ollama & Pull a Model
```bash
# Start Ollama server (runs on port 11434)
ollama serve

# In a NEW terminal, download the default model (4.7GB):
ollama pull qwen2.5-coder:7b

# Or use a smaller/faster model (2GB):
ollama pull llama3.2:3b
```

### Step 3: Clone & Run SOCA
```bash
git clone https://github.com/Akash-62/Soca-ai-driven-code-review-assistant.git
cd Soca-ai-driven-code-review-assistant
npm install
npm run dev
```
Open: http://localhost:5173

📖 **Detailed setup guide**: See [LOCAL_LLM_SETUP.md](./LOCAL_LLM_SETUP.md)

## 📦 Available Scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server (Vite) |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |

## ☁️ Deployment (Vercel)
⚠️ **Note**: SOCA now requires a local LLM backend. The Vercel deployment only hosts the **frontend UI**. 

For full functionality, you need to either:
1. Run Ollama locally and use the deployed UI to connect to `http://localhost:11434`
2. Deploy an Ollama server on a VPS and update `OLLAMA_API_URL` in `localLLMService.ts`
3. Create a serverless backend wrapper (e.g., Vercel Edge Functions) to proxy LLM requests

### Frontend-Only Deployment:
1. Push to `main` on GitHub.
2. Import the repo into Vercel (Framework: Vite detected).
3. No environment variables needed.
4. Deploy. Output directory: `dist`.

**For production use**, consider deploying Ollama on:
- Railway (https://railway.app)
- Render (https://render.com)
- AWS EC2 / Azure VM
- Your own server with public IP

Update `OLLAMA_API_URL` in `localLLMService.ts` to your server's address.

## 🧪 Future Enhancements (Roadmap)
- True real‑time online multiplayer (WebSockets / RTC)
- Serverless API layer to securely proxy Gemini calls
- Rate limiting & usage analytics
- Challenge difficulty calibration via user performance
- Export sharable review reports (PDF / Markdown)
- Authentication & user profiles

## 🤝 Contributing
PRs and issue reports welcome. Suggested flow:
1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

Please write clear commit messages and keep changes focused.

## 🛡️ Security Notes
- ✅ **No API keys** - Everything runs locally
- ✅ **Privacy-first** - Your code never leaves your machine
- ✅ **No rate limits** - Use as much as you want
- ✅ **Offline capable** - Works without internet (after model download)
- Add runtime validation for user input before sending to the model (possible future enhancement)

## 📄 License
Add a license (e.g. MIT) – currently unspecified.

---
**Maintainer:** @Akash-62  
Found a bug or have an idea? Open an issue or start a discussion.

Enjoy building with SOCA! ⚡

<div align="center">
   <img width="100%" alt="SOCA Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
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
SOCA is an AI‑assisted code review and competitive debugging playground. Paste code to get structured AI feedback, generate repair challenges, or battle in multiplayer / duel modes. Designed for learning, rapid iteration, and a bit of fun.

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
- Google Gemini API (`@google/generative-ai`)
- Deployed on Vercel

## ⚙️ Prerequisites
- Node.js 18+ (recommended LTS)
- A Gemini API Key from Google AI Studio

## 🔐 Environment Variables
Create a local `.env.local` (never commit secrets). Client‑exposed keys must be prefixed with `VITE_`.

```env
VITE_API_KEY=YOUR_GEMINI_KEY_HERE
```

In code the key is accessed via:
```ts
const apiKey = import.meta.env.VITE_API_KEY;
```

> Important: Any variable starting with `VITE_` is embedded in the client bundle. For true secrets, move logic to a serverless endpoint (not yet implemented here) and use a non‑exposed variable like `GEMINI_API_KEY` on Vercel.

## 🛠️ Local Development
```bash
git clone https://github.com/Akash-62/Soca-ai-driven-code-review-assistant.git
cd Soca-ai-driven-code-review-assistant
npm install
cp .env.local.example .env.local  # (create if you add an example file later)
# add your VITE_API_KEY value
npm run dev
```
Open: http://localhost:5173

## 📦 Available Scripts
| Script | Purpose |
|--------|---------|
| `npm run dev` | Start dev server (Vite) |
| `npm run build` | Production build (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |

## ☁️ Deployment (Vercel)
1. Push to `main` on GitHub.
2. Import the repo into Vercel (Framework: Vite detected).
3. Set Environment Variable `VITE_API_KEY` under Project → Settings → Environment Variables (Production + Preview).
4. Trigger Deploy. Output directory: `dist`.

To redeploy after changing env vars: Redeploy from the deployment page or push a new commit.

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
- Don’t leak actual secrets in `VITE_` variables if you can avoid it.
- Rotate API keys if accidentally committed (use provider console).
- Add runtime validation for user input before sending to the model (possible future enhancement).

## 📄 License
Add a license (e.g. MIT) – currently unspecified.

---
**Maintainer:** @Akash-62  
Found a bug or have an idea? Open an issue or start a discussion.

Enjoy building with SOCA! ⚡

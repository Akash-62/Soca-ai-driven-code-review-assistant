<div align="center">
   <h1>⚡ SOCA – Smart Optimized Code Auditor</h1>
   <p><strong>AI‑driven, gamified code review & challenge arena.</strong></p>
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
- AI-powered code analysis
- Deployed on Vercel

## ⚙️ Prerequisites
- Node.js 18+ (recommended LTS)

## 🔐 Configuration
Create a `.env.local` file with required API credentials (contact the maintainer for setup instructions).

## 🛠️ Local Development

### Quick Start
```bash
git clone https://github.com/Akash-62/Soca-ai-driven-code-review-assistant.git
cd Soca-ai-driven-code-review-assistant
npm install
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
3. Configure required environment variables in Vercel dashboard.
4. Deploy. Output directory: `dist`.

**Live Demo:** [https://soca-ai-driven-code-review-assistan.vercel.app](https://soca-ai-driven-code-review-assistan.vercel.app)

## 🧪 Future Enhancements (Roadmap)
- True real‑time online multiplayer (WebSockets / RTC)
- Rate limiting & usage analytics
- Challenge difficulty calibration via user performance
- Export sharable review reports (PDF / Markdown)
- Authentication & user profiles
- Code snippet sharing and collaboration features

## 🤝 Contributing
PRs and issue reports welcome. Suggested flow:
1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push: `git push origin feat/your-feature`
5. Open a Pull Request

Please write clear commit messages and keep changes focused.

## 🛡️ Security Notes
- Secure API credential management
- Input validation for user-submitted code
- Environment variables for sensitive configuration
- Regular dependency updates for security patches

## 📄 License
Add a license (e.g. MIT) – currently unspecified.

---
**Maintainer:** @Akash-62  
Found a bug or have an idea? Open an issue or start a discussion.

Enjoy building with SOCA! ⚡

# 📋 NeoLingua - Project Summary

**Last Updated:** 2026-01-01
**Version:** 1.0.0
**Status:** ✅ Production Ready

---

## 🎯 Project Overview

**NeoLingua** là ứng dụng học tiếng Anh đô thị (Urban English) hiện đại, sử dụng AI để tạo bài học cá nhân hóa.

### Core Technology
- **Frontend:** React 19 + TypeScript + Vite
- **AI:** Google Gemini API
- **Styling:** Tailwind CSS + Custom CSS
- **Animations:** Framer Motion
- **PWA:** Service Workers + Web App Manifest

---

## 📁 Project Structure

```
NeoLingua/
├── 📱 Core App Files
│   ├── index.html              # Entry HTML
│   ├── index.tsx               # React entry point
│   ├── App.tsx                 # Main app component (navigation, state)
│   ├── types.ts                # TypeScript definitions
│   └── lessons.ts              # Lesson data
│
├── 🖼️ Screen Components
│   ├── LessonDetailScreen.tsx  # Lesson view with vocab/podcast
│   ├── PodcastScreen.tsx       # Audio lesson player
│   ├── SuccessScreen.tsx       # Completion celebration
│   └── VocabVaultScreen.tsx    # Saved vocabulary manager
│
├── 🧩 UI Components (components/)
│   ├── BadgeGallery.tsx        # Achievement showcase
│   ├── BadgePopup.tsx          # Badge unlock animation
│   ├── UrbanChat.tsx           # AI chat interface
│   ├── GrainOverlay.tsx        # Visual texture effect
│   └── Icons.tsx               # SVG icon library
│
├── ⚙️ Services (services/)
│   ├── geminiService.ts        # AI lesson generation
│   ├── speechService.ts        # Text-to-speech
│   └── badgeService.ts         # Achievement tracking
│
├── 📦 Static Assets (public/)
│   ├── manifest.json           # PWA configuration
│   ├── sw.js                   # Service Worker (offline)
│   ├── icon-192.svg            # App icon (small)
│   └── icon-512.svg            # App icon (large)
│
├── 📊 Documentation
│   ├── README.md               # Main documentation
│   ├── QUICKSTART.md           # 5-minute setup guide
│   ├── DEPLOY.md               # Deployment instructions
│   ├── CHANGELOG.md            # Version history
│   └── docs/SYNC-GUIDE.md      # Sync script guide
│
├── 🔧 Build & Config
│   ├── package.json            # Dependencies & scripts
│   ├── vite.config.ts          # Vite configuration
│   ├── tsconfig.json           # TypeScript config
│   ├── vercel.json             # Vercel deployment
│   └── .gitignore              # Git ignore rules
│
├── 🤖 Automation
│   └── sync-docs.mjs           # Daily sync & reporting
│
└── 📈 Generated (auto)
    ├── reports/                # Daily project reports
    ├── dist/                   # Production build
    └── node_modules/           # Dependencies
```

---

## 🚀 Key Features

### ✅ Implemented

| Feature | Status | Files |
|---------|--------|-------|
| **8-Level Learning Path** | ✅ Complete | `App.tsx`, `lessons.ts` |
| **AI Lesson Generation** | ✅ Complete | `services/geminiService.ts` |
| **Interactive Podcasts** | ✅ Complete | `PodcastScreen.tsx` |
| **Vocab Vault** | ✅ Complete | `VocabVaultScreen.tsx` |
| **Badge System** | ✅ Complete | `components/BadgeGallery.tsx` |
| **Live AI Chat** | ✅ Complete | `components/UrbanChat.tsx` |
| **PWA Support** | ✅ Complete | `public/manifest.json`, `sw.js` |
| **Text-to-Speech** | ✅ Complete | `services/speechService.ts` |
| **Daily Sync Script** | ✅ Complete | `sync-docs.mjs` |

### 🔄 Roadmap (Future)

- [ ] User authentication (Firebase/Supabase)
- [ ] Progress sync across devices
- [ ] More lesson content (Levels 2-8)
- [ ] Analytics dashboard
- [ ] Social features (leaderboard)
- [ ] Offline lesson downloads
- [ ] Custom lesson creator

---

## 📊 Project Statistics

**Current State (as of 2026-01-01):**

- **Total Files:** 30+ files
- **Components:** 5 components
- **Services:** 3 services
- **Lines of Code:** ~2,237 lines
- **Git Commits:** 41 commits
- **Dependencies:** 4 production, 4 dev

**Build Stats:**
- **Bundle Size:** 631 KB (minified)
- **Gzip Size:** ~167 KB
- **Build Time:** ~2.7s

---

## 🔗 Important Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build

# Automation
npm run sync          # Daily sync + commit + push
npm run report        # Generate report only

# Git (manual)
git status            # Check changes
git add .             # Stage all
git commit -m "msg"   # Commit
git push origin master # Push to GitHub
```

---

## 🌐 Deployment

### Production URL
- **Platform:** Vercel
- **Repository:** https://github.com/samantha-blablabla/NeoLingua
- **Deploy:** Auto on push to `master`

### Environment Variables
```env
VITE_GEMINI_API_KEY=your_key_here
```

### Deployment Steps
1. Push to GitHub
2. Vercel auto-detects & builds
3. Add env variable in Vercel dashboard
4. Done! ✅

---

## 🎨 Design System

**Colors:**
- Primary: `#CCFF00` (Neon Yellow)
- Background: `#0A0A0A` (Dark Black)
- Text: `#FFFFFF` (White)
- Accent: `#FF6B4A` (Coral)

**Typography:**
- Heading: "Bricolage Grotesque"
- Body: "Plus Jakarta Sans"

**Animations:**
- Framer Motion for all transitions
- Magnetic reveal effects
- Smooth glassmorphism

---

## 📝 Documentation Index

| Document | Purpose | Audience |
|----------|---------|----------|
| [README.md](README.md) | Main documentation | Everyone |
| [QUICKSTART.md](QUICKSTART.md) | 5-min setup | New developers |
| [DEPLOY.md](DEPLOY.md) | Deployment guide | DevOps |
| [docs/SYNC-GUIDE.md](docs/SYNC-GUIDE.md) | Sync automation | Maintainers |
| [CHANGELOG.md](CHANGELOG.md) | Version history | Everyone |
| [reports/LATEST.md](reports/LATEST.md) | Project stats | Team |

---

## 🐛 Known Issues

**Current:**
- Bundle size large (631KB) - needs code splitting
- No error boundary for AI API failures
- Service Worker caching strategy basic

**Mitigated:**
- ✅ Import map conflicts (fixed)
- ✅ Environment variable handling (fixed)
- ✅ PWA manifest issues (fixed)

---

## 👥 Team & Credits

**Developer:** Built with Claude Code
**AI Model:** Claude Sonnet 4.5
**Design:** Modern urban aesthetic
**License:** MIT

---

## 📞 Support & Contact

- **Issues:** https://github.com/samantha-blablabla/NeoLingua/issues
- **Docs:** See README.md and guides
- **Updates:** Check CHANGELOG.md

---

## ✨ Quick Links

- 🏠 [Main README](README.md)
- ⚡ [Quick Start](QUICKSTART.md)
- 🚀 [Deploy Guide](DEPLOY.md)
- 📊 [Latest Report](reports/LATEST.md)
- 📝 [Changelog](CHANGELOG.md)

---

**Last Build:** 2026-01-01 00:26:00
**Production Status:** ✅ Live & Ready
**Maintenance:** Active

*This is a living document. Run `npm run sync` to auto-update.*

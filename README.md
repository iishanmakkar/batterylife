# ⚡ BatteryIQ — Professional Laptop Battery Health Analyzer

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06b6d4?logo=tailwindcss)

**BatteryIQ** is a premium, production-ready web app that analyzes Windows laptop battery health reports. Upload your `powercfg /batteryreport` HTML file and get instant professional analysis with health scores, degradation trends, AI-powered insights, and actionable recommendations.

## ✨ Features

- 🔒 **100% Private** — Everything runs locally in your browser. No data uploads, no servers, no tracking.
- 📊 **Health Score** — Animated SVG gauge with A+/A/B/C/F grading system
- 📈 **6 Interactive Charts** — Capacity trends, battery life, usage patterns, drain sessions, power split, comparison
- 🤖 **AI-Powered Insights** — Smart contextual recommendations based on your battery data
- 🔍 **Advanced Detection** — Fake battery detection, gaming damage estimation, resale impact analysis
- 📋 **Multi-Report Compare** — Upload multiple reports for side-by-side comparison
- 📥 **Export** — PDF report, JSON data, shareable image card
- 🌗 **Dark/Light Mode** — Premium themed UI with smooth transitions
- 💾 **Auto-Save** — Reports persist in localStorage
- 📱 **Responsive** — Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Generate a battery report:
```powershell
powercfg /batteryreport /output "%USERPROFILE%\battery-report.html"
```

### Run locally:
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling with CSS-based config |
| **Recharts** | Data visualization |
| **Framer Motion** | Animations |
| **Lucide React** | Icon system |
| **jsPDF + html2canvas** | PDF export |

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout + SEO + fonts
│   ├── page.tsx            # Main SPA page
│   └── globals.css         # Tailwind v4 theme
├── components/
│   ├── Dashboard.tsx       # Main dashboard (6 tabs)
│   ├── ScoreCard.tsx       # Animated health gauge
│   ├── UploadZone.tsx      # Drag-drop upload
│   ├── HeroSection.tsx     # Landing hero
│   ├── charts/             # 6 Recharts components
│   └── ...                 # 15 UI components
├── lib/
│   ├── parser.ts           # Battery report HTML parser
│   ├── health.ts           # Health scoring engine
│   ├── insights.ts         # AI recommendation engine
│   ├── detection.ts        # Advanced analysis
│   ├── export.ts           # PDF/JSON/Image export
│   └── types.ts            # TypeScript interfaces
└── public/
```

## 🔐 Privacy

Your battery report **never leaves your device**. All parsing, analysis, and scoring happens 100% client-side in your browser. No data is sent to any server.

## 📄 License

MIT

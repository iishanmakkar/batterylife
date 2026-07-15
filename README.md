# ⚡ BatteryIQ — Professional Laptop Battery Health Analyzer

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06b6d4?logo=tailwindcss)

BatteryIQ is a cutting-edge, production-ready web application designed to provide in-depth analysis of Windows laptop battery health reports. By simply uploading your `powercfg /batteryreport` HTML file, you gain access to instant, professional-grade insights, including comprehensive health scores, degradation trends, AI-powered recommendations, and actionable advice to prolong your battery's lifespan.

## ✨ Why BatteryIQ?

In today's mobile world, laptop battery health is crucial for productivity and device longevity. BatteryIQ empowers users with transparent, easy-to-understand data about their battery's performance, helping them make informed decisions about usage and maintenance. Unlike generic tools, BatteryIQ focuses on a privacy-first approach, ensuring all analysis is performed client-side without compromising your data.

## 🚀 Features at a Glance

| Feature | Description | Benefit to User |
|---|---|---|
| 🔒 **100% Private & Local** | All processing, analysis, and scoring occur directly in your browser. | Your sensitive battery data never leaves your device, ensuring maximum privacy and security. |
| 📊 **Interactive Health Score** | An animated SVG gauge provides an intuitive A+/A/B/C/F grading system for your battery's health. | Quickly grasp your battery's overall condition with a clear, visual indicator. |
| 📈 **6 Dynamic Charts** | Visualize capacity trends, battery life, usage patterns, drain sessions, power distribution, and comparative data. | Understand complex data through engaging, interactive charts that reveal performance over time. |
| 🤖 **AI-Powered Insights** | Receive smart, contextual recommendations tailored to your specific battery data. | Get personalized advice to optimize battery usage and extend its life. |
| 🔍 **Advanced Diagnostics** | Includes features like fake battery detection, gaming-induced damage estimation, and resale value impact analysis. | Gain deeper understanding of potential issues and their implications. |
| 📋 **Multi-Report Comparison** | Upload and compare multiple battery reports side-by-side. | Track degradation over time and observe the effectiveness of your battery care routines. |
| 📥 **Flexible Export Options** | Export your analysis as a PDF report, JSON data, or a shareable image card. | Easily share or archive your battery health reports in various formats. |
| 🌗 **Premium User Interface** | Enjoy a sleek, modern UI with seamless dark/light mode transitions. | A visually appealing and comfortable experience for all users. |
| 💾 **Automatic Local Save** | Your reports are automatically saved and persist in your browser's localStorage. | Never lose your analysis; pick up right where you left off. |
| 📱 **Fully Responsive** | Optimized for desktop, tablet, and mobile devices. | Access your battery insights anytime, anywhere, on any device. |

## ⚡ Quick Start Guide

Getting started with BatteryIQ is simple and straightforward.

### 1. Generate Your Battery Report

Open PowerShell as an Administrator and execute the following command to generate your `battery-report.html` file:

```powershell
powercfg /batteryreport /output "%USERPROFILE%\battery-report.html"
```

### 2. Upload to BatteryIQ

Visit [BatteryIQ](https://batterylife.vercel.app/) and drag-and-drop your generated `battery-report.html` file into the designated upload zone. BatteryIQ will instantly process your report and display a detailed analysis.

### 3. Run Locally (for Developers)

If you wish to run BatteryIQ on your local machine for development or enhanced privacy, follow these steps:

```bash
git clone https://github.com/iishanmakkar/batterylife.git
cd batterylife
npm install
npm run dev
```

Open your browser and navigate to [http://localhost:3000](http://localhost:3000).

## 🛠 Tech Stack

BatteryIQ is built with a robust and modern technology stack, ensuring high performance, scalability, and an excellent user experience.

| Technology | Purpose | Key Benefits |
|---|---|---|
| **Next.js 15** | React framework with App Router | Server-side rendering, routing, and API routes for a fast and scalable application. |
| **React 19** | UI library | Efficient and declarative UI development. |
| **TypeScript** | Type safety | Enhances code quality, readability, and maintainability by catching errors early. |
| **Tailwind CSS v4** | Utility-first CSS framework | Rapid UI development with highly customizable designs. |
| **Recharts** | Data visualization library | Creates beautiful and interactive charts for clear data representation. |
| **Framer Motion** | Animation library | Delivers smooth and engaging UI animations. |
| **Lucide React** | Icon system | Provides a comprehensive and customizable set of SVG icons. |
| **jsPDF + html2canvas** | PDF export functionality | Enables users to export their battery reports as professional PDF documents. |

## 📁 Project Structure

The project is organized into logical directories to facilitate development and maintenance:

```
├── app/                  # Next.js App Router (Root layout, main page, global styles)
│   ├── layout.tsx        # Defines the root layout, SEO metadata, and font configurations
│   ├── page.tsx          # The main Single Page Application (SPA) entry point
│   └── globals.css       # Global styles and Tailwind CSS v4 theme configuration
├── components/           # Reusable UI components
│   ├── Dashboard.tsx     # The primary dashboard component with multiple tabs for analysis
│   ├── ScoreCard.tsx     # Displays the animated battery health gauge
│   ├── UploadZone.tsx    # Handles drag-and-drop functionality for battery report uploads
│   ├── HeroSection.tsx   # The landing page hero section
│   ├── charts/           # Contains all Recharts components for data visualization
│   └── ...               # Additional UI components (e.g., FAQ, Footer, Navbar)
├── lib/                  # Core logic and utility functions
│   ├── parser.ts         # Parses the raw HTML battery report into structured data
│   ├── health.ts         # Implements the battery health scoring engine
│   ├── insights.ts       # Powers the AI-driven recommendation engine
│   ├── detection.ts      # Contains advanced detection algorithms (e.g., fake battery)
│   ├── export.ts         # Manages PDF, JSON, and image export functionalities
│   └── types.ts          # Defines TypeScript interfaces and types for the application
└── public/               # Static assets (e.g., favicon, service worker)
```

## 🔐 Privacy Assurance

Your privacy is paramount. BatteryIQ is designed with a strict privacy-first philosophy:

> Your battery report **never leaves your device**. All parsing, analysis, and scoring happens 100% client-side in your browser. No data is sent to any server, ensuring complete confidentiality and security of your personal data.

## 🤝 Contributing

We welcome contributions from the community! If you have suggestions for new features, bug fixes, or improvements, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## 📄 License

BatteryIQ is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT).

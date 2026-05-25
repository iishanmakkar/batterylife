# anything.com prompt for BatteryIQ

Build a premium SaaS website called BatteryIQ, based on the existing project in this workspace. The current app is a Next.js 15 + React 19 battery analysis product with Supabase auth/database, a client-side HTML parser for Windows `powercfg /batteryreport` exports, and an analysis dashboard with scores, charts, recommendations, and saved reports.

The goal is to turn this into a polished, monetizable SaaS website that helps laptop users check battery health, understand wear, and decide whether they need a replacement. The product should support ads, affiliate monetization, and paid upgrades later, but the core experience must stay fast, simple, and trustworthy.

## Product vision

Create a website where users upload a Windows battery report HTML file and instantly get a clear battery health breakdown. This should be a useful consumer tool with strong SEO potential. The site should feel like a real SaaS product, not a simple calculator.

The brand direction should stay close to BatteryIQ, but the design should feel more modern, premium, and business-ready. The site should work well for organic traffic and ad monetization while also supporting affiliate offers for replacement batteries and accessories.

## Current project context

The existing codebase already includes:

- Next.js App Router structure
- Supabase auth and report storage
- Client-side parser for Windows battery report HTML files
- Health scoring and verdict logic
- Dashboard pages for reports and devices
- Charts for capacity history and usage trends
- Upload flow for `.html` and `.htm` files
- A privacy-first message that reports are analyzed locally

Use this as the foundation, not a blank slate.

## Primary user flow

1. User lands on the homepage.
2. User sees a clear promise: check laptop battery health in seconds.
3. User uploads a Windows battery report HTML file.
4. The site parses the file and shows battery health metrics immediately.
5. The user sees whether the battery is good, worn, degraded, or needs replacement.
6. The user can optionally save the report, compare devices, export a summary, or view related recommendations.

## Core features to include

- Upload and analyze Windows `battery-report.html` files
- Parse battery report data in the browser when possible
- Show battery health percentage
- Show design capacity and full charge capacity
- Show wear level
- Show cycle count when available
- Show estimated lifespan or replacement guidance
- Show a battery score with a clear status label
- Show charts and simple visual summaries
- Show device info and report metadata
- Offer shareable report cards or summary images
- Offer PDF export or downloadable results
- Support saved reports for logged-in users
- Support device history and comparison views

## Monetization goals

Design the product so it can make money in multiple ways:

### 1. Ads

Reserve clean placements for display ads without damaging UX.
Ads should be non-intrusive and mobile-friendly.

### 2. Affiliate revenue

Add recommendation sections for:

- replacement batteries
- chargers
- cooling pads
- SSD upgrades
- laptops
- battery health accessories

If the battery health is poor, show a recommendation block with relevant affiliate products.

### 3. Premium plan

Create a Pro tier with features like:

- unlimited saved reports
- PDF export
- battery history tracking
- device comparisons
- branded reports
- AI-style insights
- advanced recommendations

## Analysis expectations

The analysis should be simple enough for non-technical users, but still useful. Show a top-level battery health score and explain what it means in plain English.

Include these metrics where available:

- original design capacity
- current full charge capacity
- battery health percentage
- wear percentage
- cycle count
- estimated remaining life
- battery score or grade
- replacement recommendation

Use clear labels like:

- Excellent
- Good
- Fair
- Degraded
- Replace Soon

If data is incomplete, the site should explain that gracefully and continue showing any available metrics.

## Homepage requirements

Create a strong, conversion-focused homepage with:

- a bold hero section
- a clear upload call to action
- a short explanation of how to get a battery report using `powercfg /batteryreport`
- trust messaging about privacy and local parsing
- feature cards
- SEO-friendly content blocks
- FAQ section
- monetization-ready sections that do not feel spammy

The homepage should answer the user’s first question immediately:

“What is my laptop battery health and do I need a replacement?”

## Dashboard requirements

Use the existing dashboard pattern as a base, but polish it into a SaaS-quality experience.

The dashboard should include:

- a large health score summary
- battery status badge
- trend chart for capacity decline
- cycle count and wear cards
- useful-life estimate
- diagnosis or recommendation panel
- report history if the user uploads multiple reports

The dashboard should be easy to scan on desktop and mobile.

## SEO requirements

The website should target these keyword themes:

- check laptop battery health
- battery report analyzer
- powercfg battery report meaning
- laptop battery health checker
- battery wear level calculator
- battery health test online

Add:

- meta titles and descriptions
- FAQ schema where relevant
- landing pages for search intent
- internal linking between articles and tools
- blog/article sections for battery education

## Content ideas for SEO

Create content sections or pages like:

- What battery health means
- How to read a Windows battery report
- When to replace a laptop battery
- Battery wear vs cycle count
- How to improve battery lifespan
- Laptop battery health by brand

## Design direction

The UI should feel like a premium utility SaaS:

- modern and professional
- clear hierarchy
- bold typography
- sleek cards and panels
- subtle gradients and soft lighting
- polished empty states
- responsive layout

Avoid generic template styling. The interface should look intentional and a little distinctive, while still being credible and easy to use.

## Technical direction

Use the current project stack and improve it rather than replacing it:

- Next.js App Router
- React 19
- TypeScript
- Supabase for auth and storage
- Chart.js for data visualization
- client-side parsing for privacy-first analysis

If needed, improve or extend the parser so it can handle more Windows battery report formats and fail gracefully when the report structure is slightly different.

## Recommended pages

- Home
- Upload and analyze
- Results dashboard
- Device comparison
- Pricing
- Blog
- FAQ
- About
- Contact
- Privacy policy
- Terms

## Copy tone

Use clear, simple, trustworthy language. Do not sound overly technical. The product should feel helpful, practical, and safe.

## Final output expected from anything.com

Generate a complete, production-ready SaaS website for BatteryIQ that:

- keeps the existing battery analysis foundation
- improves the UI and UX
- supports SEO traffic
- supports ads and affiliate monetization
- includes premium upgrade paths
- makes battery health easy for everyday users to understand

Focus on a clean upload flow, beautiful dashboard, strong search visibility, and monetization-ready structure.
# Quantum-Safe Readiness Microsite

A focused quantum-safe readiness microsite that educates visitors and generates advisory leads.

## Quick Start

```bash
# Navigate to the project
cd /Users/kareldekneef/Documents/QuantumClaude

# Start the server
node server.js
```

Then open: **http://localhost:8080**

## Features

- **Landing Page**: Hero, HNDL explainer, interactive games, migration timeline
- **Readiness Assessment**: 12-question quiz with personalized scores and recommendations
- **Education Hub**: 4 modules covering quantum threats, qubits, PQC, and implementation
- **Services Page**: Tiered offerings matched to maturity level
- **About Page**: Professional profile with credentials

## Data Storage

All data is stored in CSV files in the `data/` folder:

- `data/leads.csv` - Assessment completions and contact form submissions
- `data/analytics.csv` - Page views, events, and user journeys

## File Structure

```
QuantumClaude/
├── index.html              # Landing page
├── server.js               # Node.js server (forms + analytics)
├── css/
│   ├── main.css           # Core styles
│   └── components.css     # Component styles
├── js/
│   ├── main.js            # Core functionality
│   ├── games.js           # Interactive games
│   ├── assessment.js      # Quiz logic
│   └── analytics.js       # Event tracking
├── pages/
│   ├── assessment.html    # Readiness quiz
│   ├── education.html     # Education hub
│   ├── services.html      # Services & contact
│   └── about.html         # About Karel
├── assets/
│   └── karel-dekneef.jpg  # Profile photo
└── data/
    ├── leads.csv          # Captured leads
    └── analytics.csv      # Analytics events
```

## Analytics

Built-in analytics tracks:
- Page views
- Time on page
- Scroll depth
- CTA clicks
- Assessment progress
- Form submissions

View stats: `http://localhost:8080/api/stats`

## Customization

### Update Contact Info
Edit the footer in each HTML file to update email/LinkedIn links.

### Add Your Photo
Save your photo as `assets/karel-dekneef.jpg`

### Modify Assessment Questions
Edit `js/assessment.js` - the `questions` array contains all quiz content.

## Deployment Options

For production deployment:

1. **Netlify/Vercel**: Deploy static files + serverless function for API
2. **VPS**: Run `node server.js` with PM2 for process management
3. **Docker**: Create container with Node.js runtime

For local use, the current setup works out of the box.

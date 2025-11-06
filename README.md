<div align="center">

# 🌳 ParkPulse.ai

### AI-Powered Urban Green Space Intelligence Platform

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![ICP](https://img.shields.io/badge/Internet_Computer-Blockchain-29ABE2?style=for-the-badge&logo=internet-computer)](https://internetcomputer.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)

[Live Demo](https://parkpulseai.vercel.app) • [Architecture Docs](./ARCHITECTURE.md) • [Flow Diagrams](./HIGH_LEVEL_FLOW.md) • [API Docs](https://parkpulse-be.fly.dev/docs)

</div>

---

## 📖 Overview

**ParkPulse.ai** is a decentralized platform that combines artificial intelligence, satellite data analysis, and blockchain technology to empower communities in making informed decisions about urban green spaces. Through natural language interaction and real-time environmental analysis, citizens can analyze park impacts, create proposals, and participate in transparent, on-chain governance.

### 🎯 Mission

Transform urban planning from top-down decision-making to community-driven governance backed by data, science, and transparency.

---

## ✨ Key Features

### 🤖 AI-Powered Chat Assistant
- **Natural Language Queries** - Ask questions in plain English
- **Powered by Google Gemini 2.0** - State-of-the-art language understanding
- **Context-Aware Responses** - Remembers conversation history and selected parks

### 🛰️ Environmental Impact Analysis
- **NDVI Calculation** - Vegetation health assessment using satellite imagery
- **Air Quality Monitoring** - PM2.5 pollution levels via Google Earth Engine
- **Population Impact** - Affected residents within 10-minute walking radius
- **Demographics Analysis** - Breakdown by age groups (children, adults, seniors)

### 🗳️ Decentralized Governance (DAO)
- **Blockchain Proposals** - Immutable proposal storage on Internet Computer
- **Community Voting** - Transparent, on-chain voting mechanism
- **Government Verification** - PIN-based verification for authorized proposal creators
- **Email Notifications** - Automatic notifications to all registered users

### 👤 User Management
- **Internet Identity Login** - Secure, decentralized authentication
- **User Profiles** - Manage personal information and preferences
- **Email Integration** - Stay updated on new proposals
- **Government Employee Access** - Special privileges for verified officials

### 🗺️ Interactive Mapping
- **Leaflet.js Integration** - Beautiful, responsive maps
- **Park Selection** - Click parks to view details and analysis
- **Real-time Updates** - Dynamic map updates based on queries

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 15 + TypeScript)                   │
│                            Deployed on Vercel                                │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  • Interactive Map (Leaflet)     • AI Chat Interface                   │ │
│  │  • User Profiles                 • Proposal Voting UI                  │ │
│  │  • Internet Identity Auth        • Email Notifications Modal           │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└────────────┬──────────────────────────┬──────────────────────────────────────┘
             │ REST API                 │ Internet Identity
             │                          │ Authentication
             ▼                          ▼
┌────────────────────────┐   ┌──────────────────────────────┐
│  BACKEND (FastAPI)     │   │   ICP BLOCKCHAIN             │
│  Deployed on Fly.io    │   │   (Smart Canister)           │
│  ┌──────────────────┐  │   │   ┌───────────────────────┐  │
│  │ AI Agent         │  │   │   │ • Proposal Storage    │  │
│  │ Earth Engine API │  │   │   │ • Voting System       │  │
│  │ Email Service    │  │   │   │ • DAO Governance      │  │
│  │ User Management  │  │   │   │ • Vote Tracking       │  │
│  └──────────────────┘  │   │   └───────────────────────┘  │
└────┬───────────────────┘   └──────────────────────────────┘
     │
     ├─► Google Gemini AI (Intent Detection & Responses)
     ├─► Google Earth Engine (Environmental Data)
     ├─► Supabase (User & Park Data)
     └─► Gmail SMTP (Email Notifications)
```

> 📚 **Detailed Documentation:** See [ARCHITECTURE.md](./ARCHITECTURE.md) for system architecture and [HIGH_LEVEL_FLOW.md](./HIGH_LEVEL_FLOW.md) for user journey flows.

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version | Installation |
|-------------|---------|--------------|
| Node.js | 18+ | [Download](https://nodejs.org/) |
| Python | 3.12+ | [Download](https://python.org/) |
| npm | 9+ | Comes with Node.js |

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/parkpulse.git
cd parkpulse

# Install backend dependencies
cd api
pip install -r requirements.txt

# Install frontend dependencies
cd ../src/parkpulse_frontend
npm install
```

### Environment Configuration

#### Backend (`.env`)

Create `api/.env`:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key

# AI & Environmental APIs
GEMINI_API_KEY=your_gemini_api_key
GEE_PROJECT_ID=your_gee_project_id

# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password
APP_URL=http://localhost:3000

# Server
PORT=4000
```

<details>
<summary>📧 How to Get Gmail App Password</summary>

1. Enable 2-factor authentication on your Google account
2. Visit [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Create an app password for "Mail"
4. Copy the 16-character password to `SENDER_PASSWORD`

</details>

#### Frontend (`.env.local`)

Create `src/parkpulse_frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_ICP_NETWORK=ic
NEXT_PUBLIC_CANISTER_ID=your_canister_id
```

### Running the Application

#### Terminal 1: Start Backend
```bash
cd api
python main.py
```

#### Terminal 2: Start Frontend
```bash
cd src/parkpulse_frontend
npm run dev
```

#### Access the App
Open [http://localhost:3000](http://localhost:3000)

---

## 📱 How to Use

### 1️⃣ Explore Parks with AI
```
You: "Show me parks in Austin, Texas"
AI: ✅ Loaded 20 parks for city: Austin
    [Interactive map displays all parks]

You: [Click on a park]
AI: Selected: Zilker Park. Ask me anything!

You: "What's the air quality here?"
AI: 🌫️ PM2.5 Level: 8.5 μg/m³ (Good)
    Health Risk: Low
```

### 2️⃣ Analyze Environmental Impact
```
You: "What happens if this park is removed?"
AI: 🌳 ENVIRONMENTAL IMPACT ANALYSIS

    Removing Zilker Park would:
    • Vegetation loss: 72.3%
    • PM2.5 increase: +156% (8.5 → 21.8 μg/m³)
    • Affected residents: 35,420 people
    • Demographics: 7,200 children, 23,100 adults, 5,120 seniors
```

### 3️⃣ Create Proposals (Government Employees Only)
```
You: "Create a proposal to protect this park"
AI: ⚠️ Verifying government employee status...
    ✅ Verified! Generating proposal...

    📋 Proposal ready for blockchain submission!
    📧 Email notifications will be sent to all registered users

    [Automatically submits to ICP blockchain]

    ✅ Proposal #42 created successfully!
```

### 4️⃣ Vote on Proposals
- Receive email notification when new proposal is created
- Click "Review & Vote Now" in email
- View proposal details and environmental impact
- Cast your vote (Yes/No)
- Results stored immutably on blockchain

---

## 🛠️ Technology Stack

<table>
<tr>
<td>

### Frontend
- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Maps:** Leaflet.js
- **Auth:** Internet Identity
- **Icons:** Lucide React
- **Deployment:** Vercel

</td>
<td>

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.12
- **AI:** Google Gemini 2.0
- **GIS:** Google Earth Engine
- **Email:** Gmail SMTP
- **Database Client:** Supabase
- **Deployment:** Fly.io

</td>
</tr>
<tr>
<td>

### Database
- **Platform:** Supabase
- **Engine:** PostgreSQL 15
- **Features:**
  - Row Level Security
  - Real-time subscriptions
  - Auto-generated APIs

</td>
<td>

### Blockchain
- **Platform:** Internet Computer
- **Language:** Motoko
- **Features:**
  - Immutable storage
  - On-chain voting
  - DAO governance

</td>
</tr>
</table>

---

## 📁 Project Structure

```
ParkPulseIcp/
├── api/                              # Backend (FastAPI)
│   ├── main.py                       # API server & endpoints
│   ├── agent.py                      # AI chat agent logic
│   ├── database.py                   # Supabase queries
│   ├── email_service.py              # Email notifications
│   ├── utils.py                      # Earth Engine utilities
│   ├── models.py                     # Pydantic models
│   └── requirements.txt              # Python dependencies
│
├── src/
│   ├── parkpulse_backend/            # ICP Smart Canister
│   │   └── main.mo                   # Motoko smart contract
│   │
│   └── parkpulse_frontend/           # Frontend (Next.js)
│       ├── app/
│       │   ├── page.tsx              # Landing page
│       │   ├── chat/page.tsx         # AI chat interface
│       │   ├── options/page.tsx      # Main menu
│       │   ├── proposal/page.tsx     # DAO proposals
│       │   └── profile/page.tsx      # User profile
│       ├── components/
│       │   ├── MapView.tsx           # Interactive map
│       │   ├── WalletStatus.tsx      # Auth status
│       │   ├── ChatMessage.tsx       # Message display
│       │   └── ChatInput.tsx         # User input
│       └── lib/
│           ├── api.ts                # Backend API client
│           ├── icp.ts                # ICP integration
│           └── auth.ts               # Internet Identity
│
├── ARCHITECTURE.md                   # System architecture
├── HIGH_LEVEL_FLOW.md               # User journey flows
└── README.md                         # This file
```

---

## 🔑 Core Features Breakdown

### AI Intent Classification
The system uses Google Gemini to classify user intents:

| Intent | Example Query | Action |
|--------|---------------|--------|
| `show_parks` | "Show parks in 90210" | Query database, render map |
| `ask_area` | "How big is this park?" | Calculate area in requested units |
| `park_ndvi_query` | "How green is this park?" | Calculate vegetation health (NDVI) |
| `air_quality_query` | "What's the air quality?" | Get PM2.5 levels from Earth Engine |
| `park_removal_impact` | "What if removed?" | Full environmental impact analysis |
| `create_proposal` | "Create proposal" | Verify user, generate summary, submit to blockchain |

### Government Employee Verification
1. User logs in with Internet Identity
2. Navigates to profile page
3. Checks "I am a Government Employee"
4. Enters PIN
5. System verifies PIN before saving
6. User can now create proposals

### Email Notification System
When a proposal is created:
1. Backend retrieves all user emails from database
2. Generates beautiful HTML email with:
   - Park name and voting deadline
   - Proposal description
   - "Review & Vote Now" button
3. Sends batch emails via Gmail SMTP
4. Users receive notifications instantly
5. Click-through takes them directly to proposal page

---

## 🌐 API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/agent` | POST | AI chat interaction | Optional |
| `/api/analyze` | POST | Park removal impact analysis | No |
| `/api/ndvi` | POST | NDVI calculation | No |
| `/api/parks/{zipcode}` | GET | Get parks by zipcode | No |
| `/api/user/profile` | POST | Save user profile | No |
| `/api/user/profile/{principal}` | GET | Get user profile | No |
| `/health` | GET | Health check | No |

> 📖 **API Documentation:** Visit `/docs` endpoint for interactive Swagger UI

---

## 🧪 Testing

### Backend Health Check
```bash
curl http://localhost:4000/health
# Expected: {"status":"ok"}
```

### Test AI Agent
```bash
curl -X POST http://localhost:4000/api/agent \
  -H "Content-Type: application/json" \
  -d '{
    "message": "show parks in zipcode 20008",
    "sessionId": "test123"
  }'
```

### Test Park Analysis
```bash
curl -X POST http://localhost:4000/api/agent \
  -H "Content-Type: application/json" \
  -d '{
    "message": "what happens if removed",
    "sessionId": "test123",
    "uiContext": {"selectedParkId": "park_001"}
  }'
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Connected to GitHub repo
# Auto-deploys on push to main branch
# Live at: https://parkpulseai.vercel.app
```

### Backend (Fly.io)
```bash
# Deploy with fly.io CLI
fly deploy

# Live at: https://parkpulse-be.fly.dev
```

### Database (Supabase)
- Hosted PostgreSQL with automatic backups
- Row Level Security enabled
- Connection pooling configured

### Blockchain (ICP Mainnet)
```bash
# Deploy to Internet Computer
dfx deploy --network ic
```

---

## 🔒 Security Features

- ✅ **Decentralized Authentication** - Internet Identity (no passwords)
- ✅ **Row Level Security** - Supabase RLS policies
- ✅ **Government Verification** - PIN-based access control
- ✅ **CORS Configuration** - Restricted origins
- ✅ **Environment Variables** - Sensitive data protected
- ✅ **HTTPS Only** - All production traffic encrypted

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    principal_id TEXT UNIQUE NOT NULL,
    name TEXT,
    email TEXT,
    address_line1 TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    is_government_employee BOOLEAN DEFAULT FALSE,
    pin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

See `api/supabase_users_table.sql` for complete schema with indexes and policies.

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🐛 Report Bugs
Open an issue with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

### 💡 Suggest Features
Open an issue tagged `enhancement` with:
- Use case description
- Proposed solution
- Alternative approaches considered

### 🔧 Submit Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Environment Variables Reference

<details>
<summary>Backend Configuration (api/.env)</summary>

```env
# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI & Analytics
GEMINI_API_KEY=AIzaSy...
GEE_PROJECT_ID=ee-yourproject

# Email (Gmail)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_16_char_app_password
APP_URL=https://parkpulseai.vercel.app

# Server
PORT=4000
```

</details>

<details>
<summary>Frontend Configuration (src/parkpulse_frontend/.env.local)</summary>

```env
# Backend API
NEXT_PUBLIC_API_URL=https://parkpulse-be.fly.dev

# Internet Computer
NEXT_PUBLIC_ICP_NETWORK=ic
NEXT_PUBLIC_CANISTER_ID=br5f7-7uaaa-aaaaa-qaaca-cai
```

</details>

---

## 🎓 Learn More

- [Internet Computer Documentation](https://internetcomputer.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Google Earth Engine Guide](https://developers.google.com/earth-engine)
- [Supabase Documentation](https://supabase.com/docs)

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- **Internet Computer Foundation** - For blockchain infrastructure
- **Google** - For Gemini AI and Earth Engine APIs
- **Vercel** - For frontend hosting
- **Supabase** - For database infrastructure
- **Open Source Community** - For amazing tools and libraries

---

## 💬 Support

- 📧 Email: support@parkpulse.ai
- 💬 Discord: [Join our community](#)
- 🐦 Twitter: [@ParkPulseAI](#)
- 📚 Docs: [docs.parkpulse.ai](#)

---

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Integration with city planning databases
- [ ] Real-time collaboration features
- [ ] NFT rewards for active community members

---

<div align="center">

### 🌟 Star us on GitHub — it motivates us a lot!

**Made with 💚 for sustainable urban communities**

[⬆ Back to Top](#-parkpulseai)

</div>

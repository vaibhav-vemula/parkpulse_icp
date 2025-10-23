# ParkPulse.ai - Community-Driven Urban Green Space Platform

A decentralized platform for analyzing urban parks and creating community proposals on the Internet Computer blockchain.

---

## 🎯 What This App Does

1. **Discover Parks** - Search parks by zipcode, city, or state
2. **Analyze Impact** - AI-powered environmental impact analysis using satellite data
3. **Create Proposals** - Submit community proposals to the ICP blockchain
4. **Vote & Govern** - Community voting on park-related initiatives

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Next.js)                                      │
│  - Interactive map with park selection                   │
│  - AI chat interface (Gemini AI)                         │
│  - ICP blockchain integration                            │
└────────────────┬────────────────────────────────────────┘
                 │
                 ├──► Backend API (FastAPI)
                 │    - Natural language processing
                 │    - Environmental data analysis
                 │    - Session management
                 │
                 ├──► PostgreSQL Database
                 │    - Park geometries & metadata
                 │    - Demographics data
                 │
                 ├──► Google Earth Engine
                 │    - NDVI (vegetation health)
                 │    - PM2.5 (air quality)
                 │    - Satellite imagery analysis
                 │
                 └──► ICP Blockchain (Motoko)
                      - Immutable proposal storage
                      - Decentralized voting
                      - Community governance
```

---

## 📋 Prerequisites

### Required Software

| Software | Version | Installation |
|----------|---------|--------------|
| **Node.js** | 18+ | [Download](https://nodejs.org/) |
| **Python** | 3.12+ | [Download](https://python.org/) |
| **PostgreSQL** | 14+ | [Download](https://postgresql.org/) |
| **dfx (ICP SDK)** | Latest | `sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"` |

### Required API Keys

1. **Gemini API Key**
   - Get from: https://ai.google.dev/
   - Used for: Natural language processing

2. **Google Earth Engine Project**
   - Sign up: https://earthengine.google.com/
   - Used for: Satellite data & environmental analysis

### Database Setup

You need a PostgreSQL database with:
- Parks data (geometries, names, locations)
- Demographics data
- Environmental statistics

---

## 🚀 Installation & Setup

### Step 1: Clone & Install Dependencies

```bash
# Navigate to project
cd /hello

# Install backend dependencies
cd api
pip3 install -r requirements.txt

# Install frontend dependencies
cd ../src/parkpulse_frontend
npm install
```

### Step 2: Configure Environment Variables

#### Backend Configuration (`api/.env`)

```bash
# Database
PGHOST=localhost
PGPORT=5432
PGDATABASE=parksdb
PGUSER=postgres
PGPASSWORD=your_password

# API Keys
GEMINI_API_KEY=your_gemini_api_key_here
GEE_PROJECT_ID=your_gee_project_id

# Server
PORT=4000
```

#### Authenticate Google Earth Engine

```bash
earthengine authenticate
```

### Step 3: Start ICP Local Blockchain

```bash
# Start the Internet Computer local replica
dfx start --background

# Deploy the Motoko canister
dfx deploy parkpulse_backend

# Get canister ID (save this!)
dfx canister id parkpulse_backend
```

### Step 4: Configure Frontend

Create `src/parkpulse_frontend/.env.local`:

```bash
# ICP Configuration
NEXT_PUBLIC_ICP_CANISTER_ID=<paste-canister-id-from-step-3>
NEXT_PUBLIC_ICP_HOST=http://127.0.0.1:4943
NEXT_PUBLIC_ICP_NETWORK=local

# API URL
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## ▶️ Running the Application

### Terminal 1: Start Backend API

```bash
cd api
python3 main.py
```

**Expected output:**
```
INFO:     Started server process
INFO:     Uvicorn running on http://0.0.0.0:4000
```

### Terminal 2: Start Frontend

**⚠️ IMPORTANT:** Run from the **root directory** (not from inside src/parkpulse_frontend)

```bash
# Navigate to project root
cd /Users/vaibhav/Desktop/hello

# Start frontend using npm workspace
npm run dev --workspace=src/parkpulse_frontend
```

**Expected output:**
```
▲ Next.js 15.5.4 (Turbopack)
- Local:        http://localhost:3000
✓ Ready in 809ms
```

**Why run from root?** This project uses npm workspaces. The root `package.json` manages the frontend workspace, so commands must be run from the root directory.

### Terminal 3: Monitor ICP Blockchain (Optional)

```bash
# Check canister status
dfx canister status parkpulse_backend

# View logs
dfx canister logs parkpulse_backend
```

---

## 🎮 How to Use the App

### 1. Access the Application

Open browser: **http://localhost:3000**

### 2. Navigate to Chat Interface

Click on **"Chat"** or navigate to **http://localhost:3000/chat**

### 3. Search for Parks

Type in the chat:
```
"show parks in zipcode 20008"
```
or
```
"show parks in city Austin"
```

**What happens:**
- AI processes your query
- Backend fetches parks from PostgreSQL
- Map displays parks in that area

### 4. Select a Park

**Click on any park** on the map

**What happens:**
- Park gets highlighted
- Chat shows: "Selected: [Park Name]"
- Park ID stored in session

### 5. Analyze Environmental Impact

Type in the chat:
```
"what happens if removed"
```

**What happens:**
- Backend fetches park geometry
- Google Earth Engine analyzes:
  - NDVI (vegetation health) before/after
  - PM2.5 (air quality) before/after
  - Affected population within 10-minute walk
  - Demographics (kids, adults, seniors)
- Results stored in session
- Chat displays impact summary

### 6. Create a Proposal

Type in the chat:
```
"propose this to the community with deadline October 25, 2025"
```

**What happens:**
1. Backend validates you analyzed the park first
2. Formats proposal data (markdown description)
3. Returns `action: "submit_to_icp"`
4. **Frontend automatically submits to ICP blockchain:**
   - Environmental data
   - Demographics
   - Proposal description
   - Deadline (in nanoseconds)
5. ICP canister stores proposal immutably
6. Returns proposal ID
7. Chat displays: "✅ Proposal #1 created on ICP blockchain!"

### 7. Verify Proposal on Blockchain

```bash
# Check total proposals
dfx canister call parkpulse_backend getTotalProposals

# Get proposal details
dfx canister call parkpulse_backend getProposal '(1)'
```

---

## 🔍 Complete User Flow Example

```
User: "show parks in zipcode 20008"
AI: ✅ Loaded 15 parks for zipcode: 20008
    [Map shows 15 parks]

User: [Clicks on "Rock Creek Park"]
AI: Selected: Rock Creek Park. You can ask "what happens if removed?"

User: "what happens if removed"
AI: 🌳 ENVIRONMENTAL IMPACT ANALYSIS

    Removing Rock Creek Park would:
    • Vegetation loss: 66.7%
    • PM2.5 increase: +140.95% (10.5 → 25.3 μg/m³)
    • Affected residents: 23,000 people
    • Demographics: 5,000 kids, 15,000 adults, 3,000 seniors

User: "propose this to the community"
AI: ✅ Proposal ready for blockchain submission!

    [Frontend submits to ICP blockchain]

    ✅ Proposal successfully submitted to ICP blockchain!

    📋 Proposal ID: #1
    🏛️ Park: Rock Creek Park
    📅 Deadline: October 25, 2025
    🌐 Network: local

    Your proposal is now active and ready for community voting!
```

---

## 🧪 Testing & Verification

### Test 1: Backend Health Check

```bash
curl http://localhost:4000/health
# Expected: {"status":"ok"}
```

### Test 2: Search Parks

```bash
curl -X POST http://localhost:4000/api/agent \
  -H "Content-Type: application/json" \
  -d '{
    "message": "show parks in zipcode 20008",
    "sessionId": "test123"
  }'
```

### Test 3: Analyze Park

```bash
curl -X POST http://localhost:4000/api/agent \
  -H "Content-Type: application/json" \
  -d '{
    "message": "what happens if removed",
    "sessionId": "test123",
    "uiContext": {"selectedParkId": "park_001"}
  }'
```

### Test 4: Create Proposal

```bash
curl -X POST http://localhost:4000/api/agent \
  -H "Content-Type: application/json" \
  -d '{
    "message": "propose this to community",
    "sessionId": "test123",
    "uiContext": {"selectedParkId": "park_001"}
  }'
```

### Test 5: Verify on Blockchain

```bash
# Get total proposals
dfx canister call parkpulse_backend getTotalProposals
# Expected: (1 : nat64)

# Get proposal details
dfx canister call parkpulse_backend getProposal '(1)'
# Expected: Full proposal data including environmental impact
```

---

## 📊 Data Flow

### Proposal Creation Flow

```
1. User Message → Frontend
   "propose this to community"

2. Frontend → Backend API
   POST /api/agent
   {message, sessionId, uiContext}

3. Backend Processing
   ├─ Gemini AI classifies intent: "create_proposal"
   ├─ Retrieves removal analysis from session
   ├─ Formats environmental data
   ├─ Formats demographics data
   └─ Returns: {action: "submit_to_icp", data: {...}}

4. Frontend → ICP Canister
   actor.createProposal(
     parkName,
     parkId,
     description,
     endDateNs,
     environmentalData,
     demographics,
     creator
   )

5. ICP Canister Processing
   ├─ Validates inputs
   ├─ Increments proposal counter
   ├─ Stores in HashMap (persistent)
   ├─ Initializes voting hashmaps
   └─ Returns: proposalId (bigint)

6. Frontend Display
   ✅ Proposal #1 created on ICP blockchain!
```

---

## 🛠️ Troubleshooting

### Issue: Backend won't start

**Check:**
```bash
# Python version
python3 --version  # Should be 3.12+

# Dependencies installed
pip3 list | grep -E "fastapi|asyncpg|google-genai"

# Environment variables
cat api/.env
```

### Issue: Frontend can't connect to backend

**Check:**
```bash
# Backend is running
curl http://localhost:4000/health

# CORS is enabled (already configured)
# Check api/main.py line 66-72
```

### Issue: ICP canister not found

**Check:**
```bash
# dfx is running
dfx ping

# Canister is deployed
dfx canister id parkpulse_backend

# Frontend .env.local has correct canister ID
cat src/parkpulse_frontend/.env.local
```

### Issue: "Please analyze the park removal first"

**Cause:** Proposal requires prior analysis

**Solution:**
1. Select a park
2. Ask: "what happens if removed"
3. Wait for analysis to complete
4. Then ask: "propose this to community"

### Issue: Earth Engine authentication error

**Solution:**
```bash
# Authenticate
earthengine authenticate

# Set project in .env
GEE_PROJECT_ID=your-project-id
```

### Issue: Database connection failed

**Check:**
```bash
# PostgreSQL is running
psql -h localhost -U postgres -d parksdb -c "SELECT 1"

# Credentials in api/.env match your setup
```

---

## 📁 Project Structure

```
hello/
├── api/                          # Backend (FastAPI)
│   ├── main.py                   # Server entry point
│   ├── agent.py                  # AI intent classification & handlers
│   ├── database.py               # PostgreSQL queries
│   ├── utils.py                  # Earth Engine computations
│   ├── models.py                 # Pydantic data models
│   ├── requirements.txt          # Python dependencies
│   └── .env                      # Backend configuration
│
├── src/
│   ├── parkpulse_backend/        # ICP Canister (Motoko)
│   │   └── main.mo               # Proposal storage & voting
│   │
│   └── parkpulse_frontend/       # Frontend (Next.js)
│       ├── app/
│       │   ├── chat/page.tsx     # Chat interface
│       │   ├── options/page.tsx  # Main menu
│       │   └── layout.tsx        # App layout
│       ├── components/
│       │   ├── MapView.tsx       # Interactive map
│       │   ├── ChatMessage.tsx   # Message display
│       │   └── ChatInput.tsx     # User input
│       ├── lib/
│       │   ├── api.ts            # Backend API calls
│       │   └── icp.ts            # ICP canister integration
│       ├── types/index.ts        # TypeScript types
│       └── .env.local            # Frontend configuration
│
├── dfx.json                      # ICP canister configuration
├── package.json                  # Project metadata
└── README.md                     # This file
```

---

## 🔑 Key Features

### 1. Natural Language Interface
- Powered by **Gemini 2.0 Flash**
- Understands queries like:
  - "show parks in Austin"
  - "how big is this park"
  - "what happens if removed"
  - "propose this to community"

### 2. Environmental Analysis
- **NDVI (Normalized Difference Vegetation Index)**
  - Measures vegetation health
  - Before/after comparison
- **PM2.5 Air Quality**
  - Particulate matter concentration
  - Health impact assessment
- **Population Impact**
  - 10-minute walking distance
  - Age demographics (kids, adults, seniors)

### 3. Blockchain Governance
- **Immutable Proposals** - Stored on ICP blockchain
- **Transparent Voting** - On-chain vote tracking
- **Decentralized** - No central authority

### 4. Data Sources
- **PostgreSQL** - Park geometries & metadata
- **Google Earth Engine** - Satellite imagery & environmental data
- **Gemini AI** - Natural language understanding

---

## 🧩 Technologies Used

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Mapbox GL** - Interactive maps
- **Tailwind CSS** - Styling
- **@dfinity/agent** - ICP integration

### Backend
- **FastAPI** - Python web framework
- **asyncpg** - Async PostgreSQL client
- **Google Gemini AI** - LLM for intent classification
- **Google Earth Engine** - Geospatial analysis

### Blockchain
- **Internet Computer (ICP)** - Layer-1 blockchain
- **Motoko** - Smart contract language
- **dfx** - ICP development kit

### Database
- **PostgreSQL** - Relational database with PostGIS

---

## 📝 Environment Variables Reference

### Backend (`api/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PGHOST` | PostgreSQL host | `localhost` |
| `PGPORT` | PostgreSQL port | `5432` |
| `PGDATABASE` | Database name | `parksdb` |
| `PGUSER` | Database user | `postgres` |
| `PGPASSWORD` | Database password | `your_password` |
| `GEMINI_API_KEY` | Gemini API key | `AIza...` |
| `GEE_PROJECT_ID` | Google Earth Engine project | `ee-yourproject` |
| `PORT` | Backend server port | `4000` |

### Frontend (`src/parkpulse_frontend/.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_ICP_CANISTER_ID` | ICP canister ID | `br5f7-7uaaa...` |
| `NEXT_PUBLIC_ICP_HOST` | ICP replica URL | `http://127.0.0.1:4943` |
| `NEXT_PUBLIC_ICP_NETWORK` | Network name | `local` |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:4000` |

---

## 🚦 Quick Start Checklist

- [ ] Install Node.js, Python, PostgreSQL, dfx
- [ ] Get Gemini API key
- [ ] Set up Google Earth Engine project
- [ ] Configure PostgreSQL database with parks data
- [ ] Install backend dependencies: `cd api && pip3 install -r requirements.txt`
- [ ] Install frontend dependencies: `cd src/parkpulse_frontend && npm install`
- [ ] Create `api/.env` with database credentials and API keys
- [ ] Authenticate Earth Engine: `earthengine authenticate`
- [ ] Start ICP: `dfx start --background`
- [ ] Deploy canister: `dfx deploy parkpulse_backend`
- [ ] Create `src/parkpulse_frontend/.env.local` with canister ID
- [ ] Start backend: `cd api && python3 main.py`
- [ ] Start frontend: `npm run dev --workspace=src/parkpulse_frontend` (from root directory)
- [ ] Test: Open http://localhost:3000/chat

---

## 📞 Support & Contributing

For issues, questions, or contributions, please refer to the project repository.

---

## 📄 License

This project is part of ParkPulse.ai initiative for community-driven urban planning.

---

**Made with ❤️ for sustainable urban communities**

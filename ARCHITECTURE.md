# ParkPulse.ai - System Architecture

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USERS / CLIENTS                                 │
│                    (Web Browsers, Mobile Devices)                           │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 │ HTTPS
                                 │
┌────────────────────────────────▼────────────────────────────────────────────┐
│                         FRONTEND (Next.js 15)                               │
│                    Deployed on: Vercel                                      │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Pages:                                                               │  │
│  │  • Home (/)                    • Options (/options)                   │  │
│  │  • Chat (/chat)                • Proposal (/proposal)                 │  │
│  │  • Profile (/profile)                                                 │  │
│  │                                                                        │  │
│  │  Components:                                                          │  │
│  │  • MapView (Leaflet)           • ChatMessage                          │  │
│  │  • WalletStatus                • CustomCursor                         │  │
│  │  • AuthGuard                                                          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└───────────┬─────────────────────────────────┬──────────────────────────────┘
            │                                 │
            │ REST API                        │ Internet Identity
            │ (HTTPS)                         │ Authentication
            │                                 │
            ▼                                 ▼
┌───────────────────────────┐    ┌──────────────────────────────┐
│   BACKEND API (FastAPI)   │    │  ICP BLOCKCHAIN              │
│   Deployed on: Fly.io     │    │  (Internet Computer)         │
│  ┌─────────────────────┐  │    │  ┌────────────────────────┐  │
│  │  API Endpoints:     │  │    │  │  Smart Canister        │  │
│  │                     │  │    │  │                        │  │
│  │  • /api/agent       │◄─┼────┼──│  • Proposal Storage    │  │
│  │  • /api/analyze     │  │    │  │  • Voting System       │  │
│  │  • /api/ndvi        │  │    │  │  • DAO Governance      │  │
│  │  • /api/parks       │  │    │  │  • User Principal IDs  │  │
│  │  • /api/user/profile│  │    │  └────────────────────────┘  │
│  │  • /api/proposals   │  │    │                              │
│  └─────────────────────┘  │    │  Internet Identity Service   │
│                           │    │  • Authentication            │
│  ┌─────────────────────┐  │    │  • Principal Generation      │
│  │  Core Services:     │  │    └──────────────────────────────┘
│  │                     │  │
│  │  1. Agent Service   │──┼────┐
│  │     (AI Chat)       │  │    │
│  │                     │  │    │
│  │  2. Database Svc    │──┼───┐│
│  │     (User Data)     │  │   ││
│  │                     │  │   ││
│  │  3. Email Service   │──┼──┐││
│  │     (Notifications) │  │  │││
│  │                     │  │  │││
│  │  4. Earth Engine    │──┼─┐│││
│  │     (Env. Data)     │  │ ││││
│  └─────────────────────┘  │ ││││
└───────────────────────────┘ ││││
                              ││││
        ┌─────────────────────┘│││
        │  ┌───────────────────┘││
        │  │  ┌─────────────────┘│
        │  │  │  ┌───────────────┘
        ▼  ▼  ▼  ▼
┌────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                        │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │  Google Gemini AI    │  │  Google Earth Engine     │   │
│  │  (gemini-2.0-flash)  │  │                          │   │
│  │                      │  │  • NDVI Calculation      │   │
│  │  • Intent Detection  │  │  • PM2.5 Data           │   │
│  │  • Response Gen.     │  │  • Vegetation Analysis   │   │
│  │  • Proposal Summary  │  │  • Walkability Scores    │   │
│  └──────────────────────┘  └──────────────────────────┘   │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐   │
│  │  Supabase/PostgreSQL │  │  Gmail SMTP              │   │
│  │                      │  │                          │   │
│  │  • Users Table       │  │  • Proposal Notifs       │   │
│  │  • Park Data         │  │  • HTML Email Templates  │   │
│  │  • Statistics        │  │  • Batch Sending         │   │
│  │  • RLS Policies      │  │                          │   │
│  └──────────────────────┘  └──────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. User Authentication Flow
```
User
  │
  ├──► Click "Login with Internet Identity"
  │
  ▼
Internet Identity (ICP)
  │
  ├──► Generate/Verify Principal ID
  │
  ▼
Frontend
  │
  ├──► Store Principal in State
  │
  ├──► Auto-create User in Database
  │
  ▼
Supabase (users table)
  │
  └──► Profile Created with Principal ID
```

### 2. AI Chat Interaction Flow
```
User
  │
  ├──► Types message in chat
  │
  ▼
Frontend (Chat Page)
  │
  ├──► sendAgentMessage(message, sessionId, parkId, principalId)
  │
  ▼
Backend /api/agent
  │
  ├──► Extract Intent with Gemini AI
  │
  ├──► Route to Handler:
  │     • show_parks → Query Supabase
  │     • ask_area → Calculate from park data
  │     • park_ndvi_query → Google Earth Engine
  │     • air_quality_query → Earth Engine PM2.5
  │     • create_proposal → Check govt employee + Send emails
  │
  ▼
Response to Frontend
  │
  └──► Display in Chat UI
```

### 3. Proposal Creation Flow
```
Government Employee
  │
  ├──► "Create proposal for this park"
  │
  ▼
Backend Agent
  │
  ├──► Verify user is govt employee (Supabase)
  │
  ├──► Check park removal analysis exists
  │
  ├──► Generate proposal summary (Gemini AI)
  │
  ├──► Prepare proposal data
  │
  ├──┬─► Send to Frontend for ICP submission
  │  │
  │  └─► Get all user emails (Supabase)
  │      │
  │      └─► Send email notifications (Gmail SMTP)
  │
  ▼
Frontend
  │
  ├──► Submit to ICP Canister
  │
  ▼
ICP Blockchain
  │
  └──► Store Proposal + Open Voting
```

### 4. Email Notification Flow
```
Proposal Created
  │
  ▼
Backend (agent.py)
  │
  ├──► get_all_user_emails() from Supabase
  │
  ▼
Email Service
  │
  ├──► For each user email:
  │     • Create HTML email with park details
  │     • Include voting deadline
  │     • Add "Review & Vote" button
  │     • Send via Gmail SMTP
  │
  ▼
Users' Inboxes
  │
  └──► Click link → Redirected to /proposal page
```

## Component Details

### Frontend (Next.js)
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Map**: Leaflet.js
- **State**: React hooks (useState, useEffect)
- **Authentication**: @dfinity/auth-client
- **Deployment**: Vercel

### Backend (FastAPI)
- **Framework**: FastAPI (Python)
- **AI**: Google Gemini 2.0 Flash
- **GIS**: Google Earth Engine
- **Email**: SMTP (smtplib)
- **Database**: Supabase Python client
- **Deployment**: Fly.io

### Database (Supabase)
- **Type**: PostgreSQL
- **Tables**:
  - `users` (principal_id, name, email, address, is_government_employee, pin)
  - `parks` (geometry, name, acres, statistics)
- **Features**: Row Level Security, Auto-timestamps

### Blockchain (ICP)
- **Platform**: Internet Computer
- **Canister**: Rust-based smart contract
- **Storage**: Proposals, votes, governance data
- **Identity**: Internet Identity service

## Technology Stack

### Frontend Stack
```
Next.js 15
  ├── React 18
  ├── TypeScript
  ├── Tailwind CSS
  ├── Leaflet.js (Maps)
  ├── Lucide React (Icons)
  └── @dfinity/auth-client
```

### Backend Stack
```
Python 3.11+
  ├── FastAPI
  ├── Google Gemini API
  ├── Google Earth Engine
  ├── Supabase Client
  ├── smtplib (Email)
  └── Uvicorn (Server)
```

### Infrastructure
```
Deployment:
  ├── Frontend: Vercel
  ├── Backend: Fly.io
  ├── Database: Supabase (Managed PostgreSQL)
  ├── Blockchain: Internet Computer
  └── Email: Gmail SMTP
```

## Security Features

1. **Authentication**: Internet Identity (ICP) - Decentralized
2. **Authorization**: Government employee verification via database
3. **PIN Validation**: 6-digit PIN (000000) for govt employee verification
4. **Database Security**: Supabase Row Level Security (RLS)
5. **API Security**: CORS configuration for allowed origins
6. **Environment Variables**: Sensitive data in .env files

## Key Features by Component

### Frontend
- ✅ Internet Identity login/logout
- ✅ Interactive park map with Leaflet
- ✅ AI-powered chat interface
- ✅ User profile management
- ✅ Proposal viewing and voting
- ✅ Email requirement modal
- ✅ Custom cursor and animations

### Backend
- ✅ AI agent with intent classification
- ✅ Park data queries and statistics
- ✅ Environmental impact analysis (NDVI, PM2.5)
- ✅ Government employee verification
- ✅ Email notifications to all users
- ✅ User profile CRUD operations

### Blockchain
- ✅ Decentralized proposal storage
- ✅ Community voting mechanism
- ✅ DAO governance
- ✅ Immutable voting records

### Integrations
- ✅ Google Gemini AI for intelligent responses
- ✅ Google Earth Engine for environmental data
- ✅ Gmail SMTP for email notifications
- ✅ Supabase for user and park data

## Environment Variables

```env
# Backend (.env)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx
GEMINI_API_KEY=xxx
GEE_PROJECT_ID=xxx
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=xxx@gmail.com
SENDER_PASSWORD=xxx
APP_URL=https://parkpulseai.vercel.app
PORT=4000
```

```env
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=https://parkpulse-be.vercel.app
NEXT_PUBLIC_ICP_NETWORK=ic
NEXT_PUBLIC_CANISTER_ID=xxx
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────┐
│              Production Environment                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Frontend: parkpulseai.vercel.app                   │
│  ├── Edge Network (Vercel CDN)                      │
│  ├── Auto SSL/TLS                                   │
│  └── Environment: production                        │
│                                                      │
│  Backend: parkpulse-be.fly.io                       │
│  ├── Region: US East                                │
│  ├── Auto-scaling                                   │
│  └── Health checks enabled                          │
│                                                      │
│  Database: Supabase Cloud                           │
│  ├── PostgreSQL 15                                  │
│  ├── Auto-backups                                   │
│  └── Connection pooling                             │
│                                                      │
│  Blockchain: ICP Mainnet                            │
│  ├── Distributed nodes                              │
│  ├── Smart canister                                 │
│  └── Internet Identity                              │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## API Endpoints Reference

| Endpoint | Method | Purpose | Authentication |
|----------|--------|---------|----------------|
| `/api/agent` | POST | AI chat interaction | Optional (Principal) |
| `/api/analyze` | POST | Park removal impact | None |
| `/api/ndvi` | POST | NDVI calculation | None |
| `/api/parks/{zipcode}` | GET | Get parks by zipcode | None |
| `/api/user/profile` | POST | Save user profile | None |
| `/api/user/profile/{principal}` | GET | Get user profile | None |
| `/api/proposals` | GET | List all proposals | None |
| `/api/proposals/{id}` | GET | Get proposal details | None |

---

**Created**: 2025-01-05
**Version**: 1.0
**Author**: ParkPulse Development Team

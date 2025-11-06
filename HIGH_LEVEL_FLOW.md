# ParkPulse.ai - High-Level Flow Diagram

## Complete User Journey Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            USER ARRIVES AT PARKPULSE.AI                         │
└────────────────────────────────┬────────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   Landing Page (/)     │
                    │  • Welcome Message     │
                    │  • "Get Started"       │
                    └───────────┬────────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │  Options Page          │
                    │  Choose Your Path:     │
                    │  1. AI Assistant       │
                    │  2. DAO Proposals      │
                    └───┬──────────────┬─────┘
                        │              │
        ┌───────────────┘              └────────────────┐
        │                                               │
        ▼                                               ▼
┌───────────────────────┐                    ┌──────────────────────┐
│   PATH 1: AI CHAT     │                    │  PATH 2: PROPOSALS   │
│   (Explore Parks)     │                    │  (Vote & Govern)     │
└───────┬───────────────┘                    └──────┬───────────────┘
        │                                            │
        │                                            │
        │                                            ▼
        │                              ┌──────────────────────────┐
        │                              │  Login Required?         │
        │                              │  (Internet Identity)     │
        │                              └──────┬──────────┬────────┘
        │                                     │          │
        │                                     │ Yes      │ No
        │                                     ▼          │
        │                          ┌──────────────────┐ │
        │                          │  Login Process   │ │
        │                          │  1. Click Login  │ │
        │                          │  2. II Auth      │ │
        │                          │  3. Get Principal│ │
        │                          │  4. Auto-create  │ │
        │                          │     in Database  │ │
        │                          └────────┬─────────┘ │
        │                                   │           │
        │                                   └───────────┘
        │                                        │
        │                                        ▼
        │                          ┌──────────────────────────┐
        │                          │  Check Email in Profile? │
        │                          └──────┬──────────┬────────┘
        │                                 │          │
        │                          No     │          │ Yes
        │                          Email  │          │ Has Email
        │                                 │          │
        │                                 ▼          │
        │                    ┌──────────────────┐   │
        │                    │  Show Email      │   │
        │                    │  Modal:          │   │
        │                    │  "Add email to   │   │
        │                    │  receive updates"│   │
        │                    │                  │   │
        │                    │  [Go to Profile] │   │
        │                    │  [Maybe Later]   │   │
        │                    └────────┬─────────┘   │
        │                             │             │
        │                             └─────────────┘
        │                                    │
        │                                    ▼
        │                          ┌──────────────────────┐
        │                          │  View Proposals      │
        │                          │  • Active Proposals  │
        │                          │  • Park Details      │
        │                          │  • Vote Yes/No       │
        │                          │  • See Results       │
        │                          └──────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────┐
│               AI CHAT INTERACTION FLOW                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  1. User Enters Message                                  │
│     "Show me parks in Austin"                            │
│                    ▼                                      │
│  2. Backend Analyzes Intent (Gemini AI)                  │
│     ➜ Intent: show_parks                                 │
│     ➜ Location: Austin, city                             │
│                    ▼                                      │
│  3. Query Database for Parks                             │
│     ➜ Get park geometries                                │
│     ➜ Return feature collection                          │
│                    ▼                                      │
│  4. Display Parks on Map                                 │
│     ➜ Show pins on Leaflet map                           │
│     ➜ List parks in sidebar                              │
│                                                           │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  5. User Clicks a Park                                   │
│                    ▼                                      │
│  6. User Asks Questions:                                 │
│                                                           │
│     "What's the area?"                                   │
│     ➜ Calculate and show in acres/m²/km²                 │
│                                                           │
│     "How green is this park?"                            │
│     ➜ Calculate NDVI (Earth Engine)                      │
│     ➜ Show vegetation health score                       │
│                                                           │
│     "What's the air quality?"                            │
│     ➜ Get PM2.5 data (Earth Engine)                      │
│     ➜ Show health impact assessment                      │
│                                                           │
│     "How many people live here?"                         │
│     ➜ Get population statistics                          │
│     ➜ Show demographics breakdown                        │
│                                                           │
│     "What if this park is removed?"                      │
│     ➜ Calculate environmental impact                     │
│     ➜ Show vegetation loss %                             │
│     ➜ Show PM2.5 increase %                              │
│     ➜ Show affected population                           │
│     ➜ Store analysis for proposal                        │
│                                                           │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  User Wants to Create Proposal?      │
        │  "Create proposal for this park"     │
        └──────┬───────────────────────────────┘
               │
               ▼
    ┌──────────────────────────┐
    │  Check User Status:      │
    │  • Logged in?            │
    │  • Govt Employee?        │
    └──────┬──────────┬────────┘
           │          │
    Yes    │          │ No
    Govt   │          │ Regular User
    Employee│         │
           │          ▼
           │    ┌──────────────────────────┐
           │    │  Show Error:             │
           │    │  "Only government        │
           │    │   employees can create   │
           │    │   proposals"             │
           │    └──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────┐
│           PROPOSAL CREATION FLOW                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Verify Prerequisites                                │
│     ✓ Park removal analysis exists                      │
│     ✓ User is government employee                       │
│                    ▼                                     │
│  2. Generate Proposal (Gemini AI)                       │
│     • Create compelling summary                         │
│     • Highlight environmental impact                    │
│     • Include demographics data                         │
│                    ▼                                     │
│  3. Prepare Proposal Data                               │
│     • Park name & ID                                    │
│     • Description (AI-generated)                        │
│     • End date for voting                               │
│     • Environmental metrics                             │
│     • Demographics data                                 │
│                    ▼                                     │
│  4. Send to Frontend                                    │
│     • User reviews proposal                             │
│     • Clicks "Submit to Blockchain"                     │
│                    ▼                                     │
│  5. Submit to ICP Blockchain                            │
│     • Store in smart canister                           │
│     • Open for community voting                         │
│     • Get proposal ID                                   │
│                    ▼                                     │
│  6. Send Email Notifications (Async)                    │
│     • Get all user emails from database                 │
│     • Create HTML email template                        │
│     • Include park name, deadline, description          │
│     • Send to all users with emails                     │
│                    ▼                                     │
│  7. Confirmation                                        │
│     ✓ "Proposal submitted successfully!"                │
│     ✓ "Email notifications sent to all users"           │
│                                                          │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │  Community Votes       │
              │  • Users receive email │
              │  • Click "Vote Now"    │
              │  • Vote Yes/No         │
              │  • Results updated     │
              │  • Voting ends         │
              └────────────────────────┘
```

## Simplified Main User Paths

### 🗺️ Path A: Park Explorer (No Login Required)

```
User → Chat Page → Ask about parks → View on map → Get insights
```

**Example Journey:**
1. "Show me parks in Austin, TX"
2. See 20 parks on map
3. Click a park
4. "What's the air quality here?"
5. Get PM2.5 reading and health assessment

### 🗳️ Path B: Community Voter (Login Required)

```
User → Login → Options → Proposals → View → Vote
```

**Example Journey:**
1. Click "Login with Internet Identity"
2. Authenticate with II
3. Auto-created in database
4. See email modal (if no email)
5. Go to proposals
6. Vote on active proposals

### 🏛️ Path C: Government Employee (Special Access)

```
User → Login → Profile → Verify → Chat → Analyze → Create Proposal → Notify All
```

**Example Journey:**
1. Login with Internet Identity
2. Go to profile
3. Check "Government Employee"
4. Enter PIN: 000000
5. Save profile
6. Analyze park removal impact
7. Create proposal
8. All users get email notification

## Data Flow at Each Stage

### Stage 1: User Interaction
```
Browser → Next.js Frontend → User Action
```

### Stage 2: Authentication
```
Frontend → Internet Identity → Principal ID → Database (Auto-create)
```

### Stage 3: AI Query Processing
```
User Message → FastAPI → Gemini AI → Intent Detection → Route to Handler
```

### Stage 4: Environmental Analysis
```
Park Geometry → Google Earth Engine → NDVI/PM2.5 Calculation → Return Data
```

### Stage 5: Proposal Submission
```
Govt User → Analysis → Gemini Summary → ICP Blockchain → Email All Users
```

### Stage 6: Community Voting
```
Email Notification → User Clicks Link → Proposal Page → Cast Vote → ICP Storage
```

## Key Decision Points

```
┌─────────────────────────────────────────────────────┐
│              DECISION TREE                          │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Is user logged in?                                 │
│  ├─ No  → Can browse & chat, cannot vote           │
│  └─ Yes → Can vote, view profile                   │
│                                                      │
│  Does user have email?                              │
│  ├─ No  → Show modal to add email                  │
│  └─ Yes → Receives proposal notifications           │
│                                                      │
│  Is user government employee?                       │
│  ├─ No  → Cannot create proposals                  │
│  └─ Yes → Can create proposals                     │
│                                                      │
│  Has user analyzed park removal?                    │
│  ├─ No  → Must analyze first                       │
│  └─ Yes → Can create proposal                      │
│                                                      │
│  Is PIN correct (000000)?                           │
│  ├─ No  → Cannot save as govt employee             │
│  └─ Yes → Verified government employee             │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## System Events Timeline

```
Time    Event                           Action
────    ─────────────────────────────   ──────────────────────────────
T+0s    User visits site                Load landing page
T+1s    Click "Get Started"             Navigate to options
T+2s    Choose "AI Assistant"           Open chat interface
T+3s    Type message                    Send to backend
T+4s    Gemini processes intent         Classify and route
T+5s    Query database/Earth Engine     Get data
T+6s    Display results                 Show on map/chat
T+30s   User clicks park                Select park on map
T+35s   Ask "What if removed?"          Trigger impact analysis
T+40s   Show impact results             Display metrics
T+45s   "Create proposal"               Check permissions
T+46s   Verify govt employee            Query database
T+47s   Generate proposal summary       Call Gemini API
T+50s   Submit to blockchain            ICP canister write
T+51s   Send emails (async)             Gmail SMTP batch send
T+52s   Confirmation to user            Success message
T+60s   Users receive email             Check inbox
T+300s  Users click "Vote Now"          Open proposal page
T+305s  Cast vote                       Submit to ICP
```

## Critical Success Paths

### ✅ Happy Path: Regular User
```
Visit → Explore → Chat → Get Insights → Leave Satisfied
```

### ✅ Happy Path: Voter
```
Visit → Login → Add Email → View Proposals → Vote → See Results
```

### ✅ Happy Path: Government Employee
```
Visit → Login → Setup Profile (PIN) → Analyze Park → Create Proposal →
All Users Notified → Community Votes → Proposal Passed/Failed
```

### ❌ Error Paths Handled
```
• No park selected → "Please click a park first"
• Not logged in for voting → "Please login to vote"
• Regular user creates proposal → "Only govt employees can create"
• Wrong PIN → "Invalid PIN"
• No analysis before proposal → "Please analyze park removal first"
```

---

**Purpose**: This high-level flow shows the complete user journey through ParkPulse.ai, from landing to creating proposals and community voting.

**Last Updated**: 2025-01-05

# ParkPulse.ai Frontend

Modern, interactive web application for exploring urban parks and green spaces with AI-powered chat assistance.

## Features

- 🗺️ **Interactive Map** - Visualize parks with Mapbox GL JS
- 💬 **AI Chat Assistant** - Natural language queries about parks
- 🎨 **Modern UI** - Clean, gradient-based design with Tailwind CSS
- ⚡ **Real-time Updates** - Instant park data visualization
- 📊 **Park Analytics** - NDVI, air quality, and impact assessments

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Mapbox GL JS** - Interactive maps
- **Lucide React** - Modern icons

## Prerequisites

- Node.js 18+ and npm
- Mapbox account and API token ([Get one here](https://account.mapbox.com/access-tokens/))
- Backend API running on `http://localhost:4000`

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

**Important:** Replace `your_mapbox_token_here` with your actual Mapbox token.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
parkpulsefe/
├── app/
│   ├── page.tsx          # Main application page
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── ChatMessage.tsx   # Chat message component
│   ├── ChatInput.tsx     # Chat input with suggestions
│   └── MapView.tsx       # Mapbox map component
├── lib/
│   └── api.ts           # API client functions
└── types/
    └── index.ts         # TypeScript type definitions
```

## Usage

### Chat Commands

Try these queries in the chat:

- **Find Parks:**
  - "show parks in Austin"
  - "show parks in 90210"
  - "find parks in zipcode 20008"

- **Park Details (select a park first):**
  - "how big is this park?"
  - "what's the NDVI?"
  - "what happens if removed?"
  - "tell me about this park"
  - "what's the air quality?"

### Map Interaction

1. **View Parks** - Ask for parks in a location
2. **Select Park** - Click any green polygon on the map
3. **Get Details** - Ask questions about the selected park

## API Integration

The frontend connects to the ParkPulse.ai backend API:

- `POST /api/agent` - Send chat messages
- `GET /api/proposals` - Get community proposals
- `GET /api/proposals/{id}` - Get proposal details

## Building for Production

```bash
npm run build
npm start
```

## Customization

### Colors

The app uses emerald/teal gradients. To change colors, update:

- `app/page.tsx` - Header gradients
- `components/ChatInput.tsx` - Button colors
- `components/MapView.tsx` - Park polygon colors

### Map Style

Change the Mapbox style in `components/MapView.tsx`:

```typescript
style: 'mapbox://styles/mapbox/light-v11'
```

Options: `light-v11`, `dark-v11`, `streets-v12`, `satellite-v9`

## Troubleshooting

### Map not loading
- Verify `NEXT_PUBLIC_MAPBOX_TOKEN` is set correctly
- Check browser console for errors
- Ensure token has required scopes

### API errors
- Confirm backend is running on port 4000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is enabled on backend

### Parks not showing
- Ensure backend database has park data
- Check network tab for API response
- Verify GeoJSON format in response

## License

Part of the ParkPulse.ai project.

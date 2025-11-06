import os
import asyncio
from typing import Optional, Dict, Any
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
import logging
import warnings
from dotenv import load_dotenv

from database import (
    init_db, close_db, query_parks_by_location, query_park_area_by_id,
    get_park_statistics_by_id, query_park_stat_by_id, get_park_ndvi,
    get_park_information, get_park_air_quality, analyze_park_removal_impact,
    analyze_park_removal_pollution_impact, save_user_profile, get_user_profile
)
from models import (
    AgentRequest, LocationQuery, AnalyzeRequest, NDVIRequest,
    Intent, LocationType, Unit, LandUseType, IntentClassification,
    UserProfile
)
from utils import (
    geometry_from_geojson, compute_ndvi, compute_walkability, compute_pm25,
    assess_air_quality_and_damage, get_air_quality_recommendations,
    compute_population, simulate_replacement_with_buildings,
    get_health_risk_category, get_environmental_damage_level
)
from agent import handle_agent_request, handle_analyze_request, handle_ndvi_request

load_dotenv()
warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

session_storage: Dict[str, Dict[str, Any]] = {}

# Earth Engine initialization moved to utils.py for lazy loading


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    logger.info("Database connection pool initialized")
    yield
    await close_db()

app = FastAPI(
    title="ParkPulse.ai API",
    description="Urban planning and GIS-aware API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://parkpulseai.vercel.app",
        "https://parkpulse.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
_gemini_client = None

def get_gemini_client():
    """Lazy initialization of Gemini client (for serverless compatibility)"""
    global _gemini_client
    if _gemini_client is None:
        gemini_api_key = os.getenv("GEMINI_API_KEY")
        if not gemini_api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        try:
            _gemini_client = genai.Client(api_key=gemini_api_key)
            logger.info("Gemini API client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini API client: {e}")
            raise e
    return _gemini_client


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "ParkPulse.ai API",
        "version": "1.0.0",
        "description": "Urban planning and GIS-aware API",
        "endpoints": {
            "agent": "POST /api/agent - AI agent for park queries",
            "analyze": "POST /api/analyze - Analyze park removal impact",
            "ndvi": "POST /api/ndvi - Calculate NDVI for a location",
            "health": "GET /health - Health check",
            "proposals": "GET /api/proposals - Get all active proposals",
            "proposal_details": "GET /api/proposals/{id} - Get proposal details",
            "contract_info": "GET /api/contract-info - Get blockchain contract info"
        },
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.post("/api/agent")
async def agent_endpoint(request: AgentRequest):
    return await handle_agent_request(request, get_gemini_client())

@app.post("/api/analyze")
async def analyze_endpoint(request: AnalyzeRequest):
    return await handle_analyze_request(request)

@app.post("/api/ndvi")
async def ndvi_endpoint(request: NDVIRequest):
    return await handle_ndvi_request(request)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.get("/api/parks/{zipcode}")
async def get_parks_by_zipcode(zipcode: str):
    """Get parks by zipcode"""
    try:
        logger.info(f"GET /api/parks/{zipcode} - Fetching parks for zipcode")
        query = LocationQuery(zip=zipcode)
        feature_collection = await query_parks_by_location(query)

        if not feature_collection or not feature_collection.get('features'):
            return {
                "success": False,
                "error": f"No parks found for zipcode {zipcode}"
            }

        return {
            "success": True,
            "featureCollection": feature_collection,
            "count": len(feature_collection.get('features', []))
        }

    except Exception as e:
        logger.error(f"Error fetching parks for zipcode {zipcode}: {e}")
        return {"success": False, "error": str(e)}

@app.post("/api/user/profile")
async def save_profile(profile: UserProfile):
    """Save or update user profile"""
    try:
        logger.info(f"Saving profile for principal {profile.principal_id}")
        result = await save_user_profile(profile.dict())
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        logger.error(f"Error saving user profile: {e}")
        return {"success": False, "error": str(e)}

@app.get("/api/user/profile/{principal_id}")
async def get_profile(principal_id: str):
    """Get user profile by principal ID"""
    try:
        logger.info(f"Fetching profile for principal {principal_id}")
        profile = await get_user_profile(principal_id)

        if not profile:
            return {
                "success": False,
                "error": "Profile not found"
            }

        return {
            "success": True,
            "data": profile
        }
    except Exception as e:
        logger.error(f"Error fetching user profile: {e}")
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 4000)), reload=True)
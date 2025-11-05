import os
import json
import asyncio
from typing import Optional, Dict, Any, List
from datetime import datetime
from contextlib import asynccontextmanager
import asyncpg
import ee
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
    analyze_park_removal_pollution_impact
)
from models import (
    AgentRequest, LocationQuery, AnalyzeRequest, NDVIRequest,
    Intent, LocationType, Unit, LandUseType, IntentClassification
)
from utils import (
    geometry_from_geojson, compute_ndvi, compute_walkability, compute_pm25,
    assess_air_quality_and_damage, get_air_quality_recommendations,
    compute_population, simulate_replacement_with_buildings,
    get_health_risk_category, get_environmental_damage_level
)
from agent import handle_agent_request, handle_analyze_request, handle_ndvi_request

load_dotenv()

# Suppress pydantic warnings from google-genai package
warnings.filterwarnings("ignore", category=UserWarning, module="pydantic")

# Setup logging first
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Session storage for tracking removal analysis results
session_storage: Dict[str, Dict[str, Any]] = {}

# Initialize Earth Engine with service account or default credentials
gee_project_id = os.getenv('GEE_PROJECT_ID')
gee_service_account = os.getenv('GEE_SERVICE_ACCOUNT')
gee_private_key = os.getenv('GEE_PRIVATE_KEY')

if gee_service_account and gee_private_key:
    # Production: Use service account credentials
    try:
        # Construct service account JSON from environment variables
        service_account_info = {
            "type": "service_account",
            "project_id": gee_project_id,
            "private_key": gee_private_key.replace('\\n', '\n'),  # Handle escaped newlines
            "client_email": gee_service_account,
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs"
        }

        # Convert dict to JSON string
        credentials = ee.ServiceAccountCredentials(gee_service_account, key_data=json.dumps(service_account_info))
        ee.Initialize(credentials, project=gee_project_id)
        logger.info("Earth Engine initialized with service account")
    except Exception as e:
        logger.error(f"Failed to initialize Earth Engine with service account: {e}")
        raise
else:
    # Local development: Use default credentials
    ee.Initialize(project=gee_project_id)
    logger.info("Earth Engine initialized with default credentials")


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
        "https://*.vercel.app",
        "https://parkpulse.vercel.app", 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY environment variable is required")

try:
    client = genai.Client(api_key=gemini_api_key)
    logger.info("Gemini API client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Gemini API client: {e}")
    raise e


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
    return await handle_agent_request(request, client)

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 4000)), reload=True)
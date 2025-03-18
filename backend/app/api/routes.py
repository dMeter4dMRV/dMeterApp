from fastapi import APIRouter, HTTPException
from app.schemas.satellite import SatelliteAnalysisRequest, SatelliteAnalysisResponse
from app.core.analysis import analyze_satellite_data
from app.core.environmental import get_environmental_data

router = APIRouter()

@router.post("/satellite/analyze", response_model=SatelliteAnalysisResponse)
async def analyze_satellite(request: SatelliteAnalysisRequest):
    try:
        result = await analyze_satellite_data(request)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/environmental/{lat}/{lng}")
async def get_environmental(lat: float, lng: float):
    try:
        data = await get_environmental_data(lat, lng)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
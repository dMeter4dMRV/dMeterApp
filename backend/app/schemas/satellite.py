from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime

class Location(BaseModel):
    lat: float
    lng: float
    area: Optional[float] = None

class AnalysisConfig(BaseModel):
    modelType: str
    dataSource: str
    timeRange: Dict[str, datetime]
    deepLearning: Optional[Dict[str, any]] = None

class SatelliteAnalysisRequest(BaseModel):
    location: Location
    config: AnalysisConfig

class HealthDeterminant(BaseModel):
    mean: Optional[float] = None
    total: Optional[float] = None
    range: Optional[str] = None
    trend: Optional[float] = None

class EcosystemService(BaseModel):
    food: float
    water: float
    rawMaterials: float

class VulnerabilityAssessment(BaseModel):
    populationDensity: float
    environmentalExposure: float
    healthInfrastructure: float
    overallVulnerability: float

class Change(BaseModel):
    before: float
    after: float
    difference: float
    confidence: float

class SatelliteAnalysisResponse(BaseModel):
    location: Location
    config: AnalysisConfig
    healthDeterminants: Dict[str, HealthDeterminant]
    ecosystemServices: Dict[str, Dict[str, float]]
    vulnerabilityAssessment: VulnerabilityAssessment
    changes: Dict[str, Change]
    timestamp: datetime 
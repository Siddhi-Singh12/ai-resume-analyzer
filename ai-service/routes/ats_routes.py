from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.ats_predictor import calculate_detailed_ats, predict_ats_score

router = APIRouter(prefix="/ats", tags=["ATS Analysis"])

class ATSRequest(BaseModel):
    resume_text: str
    job_description: Optional[str] = ""

@router.post("/score")
@router.post("/analyze")
def ats_score_endpoint(data: ATSRequest):
    """
    Returns explainable ATS Score (0-100) and 7-component breakdown.
    """
    breakdown = calculate_detailed_ats(data.resume_text, data.job_description or "")
    return {
        "ats_score": breakdown["overall_score"],
        "breakdown": breakdown,
        **breakdown
    }
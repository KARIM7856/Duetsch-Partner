from fastapi import APIRouter

from app.core.analyzer import analyzer
from app.models.schemas import AnalyzeRequest, AnalyzeResponse

router = APIRouter()


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_german(request: AnalyzeRequest):
    return await analyzer.analyze(request.text)

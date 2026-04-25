from fastapi import APIRouter, UploadFile

from app.core.analyzer import analyzer
from app.models.schemas import TranscribeResponse
from app.services.transcription import transcriber

router = APIRouter()


@router.post("/transcribe", response_model=TranscribeResponse)
async def transcribe_audio(file: UploadFile):
    audio_bytes = await file.read()
    transcription = await transcriber.transcribe(audio_bytes, filename=file.filename or "audio.webm")
    analysis = await analyzer.analyze(transcription)
    return TranscribeResponse(transcription=transcription, analysis=analysis)

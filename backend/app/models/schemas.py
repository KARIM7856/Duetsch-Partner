from pydantic import BaseModel


class AnalyzeRequest(BaseModel):
    text: str


class WordAnalysis(BaseModel):
    word: str
    is_correct: bool
    correction: str | None = None
    rule_name: str | None = None
    rule_url: str | None = None


class AnalyzeResponse(BaseModel):
    original_text: str
    corrected_text: str
    words: list[WordAnalysis]
    score: float


class TranscribeResponse(BaseModel):
    transcription: str
    analysis: AnalyzeResponse

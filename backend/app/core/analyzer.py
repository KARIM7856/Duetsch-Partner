import json
import logging

from google import genai
from google.genai import types

from app.config import settings
from app.core.prompts import (
    ANALYSIS_SYSTEM_PROMPT,
    COMPLEXITY_KEYWORDS,
    PASSIVE_INDICATORS,
)
from app.models.schemas import AnalyzeResponse, WordAnalysis

logger = logging.getLogger(__name__)


class GermanAnalyzer:
    def __init__(self):
        self.client = genai.Client(api_key=settings.gemini_api_key)

    async def analyze(self, text: str) -> AnalyzeResponse:
        response = self.client.models.generate_content(
            model="gemini-2.5-flash-lite",
            config=types.GenerateContentConfig(
                system_instruction=ANALYSIS_SYSTEM_PROMPT,
                response_mime_type="application/json",
            ),
            contents=[text],
        )

        data = json.loads(response.text)

        words = [WordAnalysis(**w) for w in data["analysis"]]
        corrected_text = data.get("corrected_sentence", text)

        total = len(words)
        correct = sum(1 for w in words if w.is_correct)
        base_score = (correct / total * 100) if total > 0 else 0
        complexity = self._calculate_complexity_factor(text)
        score = min(round(base_score * complexity, 1), 100)

        return AnalyzeResponse(
            original_text=text,
            corrected_text=corrected_text,
            words=words,
            score=score,
        )

    def _calculate_complexity_factor(self, text: str) -> float:
        text_lower = text.lower()
        factor = 1.0

        for keyword in COMPLEXITY_KEYWORDS:
            if keyword in text_lower:
                factor += 0.05

        for indicator in PASSIVE_INDICATORS:
            if indicator in text_lower:
                factor += 0.1
                break

        return min(factor, 1.3)


analyzer = GermanAnalyzer()

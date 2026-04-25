from openai import AsyncOpenAI

from app.config import settings


class WhisperTranscriber:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)

    async def transcribe(self, audio_bytes: bytes, filename: str = "audio.webm") -> str:
        response = await self.client.audio.transcriptions.create(
            model="whisper-1",
            file=(filename, audio_bytes),
            language="de",
        )
        return response.text


transcriber = WhisperTranscriber()

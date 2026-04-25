from pathlib import Path

from pydantic_settings import BaseSettings

# Resolve .env from project root (parent of backend/)
_ENV_FILE = Path(__file__).parent.parent.parent / ".env"


class Settings(BaseSettings):
    gemini_api_key: str = ""
    openai_api_key: str = ""
    database_url: str = "postgresql://deutschflow:deutschflow@db:5432/deutschflow"
    livekit_api_key: str = ""
    livekit_api_secret: str = ""

    model_config = {"env_file": str(_ENV_FILE), "env_file_encoding": "utf-8"}


settings = Settings()

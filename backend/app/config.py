import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Render/other cloud hosts provide a single DATABASE_URL - use it if present.
    RAW_DATABASE_URL = os.getenv("DATABASE_URL", "")

    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_NAME = os.getenv("DB_NAME", "ai_design_assistant")

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev_secret_change_me")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "1440"))

    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

    @property
    def DATABASE_URL(self):
        if self.RAW_DATABASE_URL:
            url = self.RAW_DATABASE_URL
            if url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+psycopg2://", 1)
            return url
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

settings = Settings()
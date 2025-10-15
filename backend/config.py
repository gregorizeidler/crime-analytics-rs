"""Configuration management for the Crime Analytics Chatbot."""
import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import List, Union
from pydantic import field_validator
from dotenv import load_dotenv

# Load .env file explicitly
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


class Settings(BaseSettings):
    """Application settings."""
    
    # Database Configuration
    db_host: str = "crime-analytics-rs-crime-analytics-rs.h.aivencloud.com"
    db_name: str = "defaultdb"
    db_user: str = "avnadmin"
    db_password: str  # Loaded from environment variable
    db_port: str = "11549"
    
    # OpenAI Configuration
    openai_api_key: str
    
    # Backend Configuration
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000
    
    # CORS Configuration
    cors_origins: Union[List[str], str] = "http://localhost:3000,http://localhost:5173"
    
    @field_validator('cors_origins', mode='before')
    @classmethod
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v
    
    @property
    def database_url(self) -> str:
        """Generate database URL."""
        return f"postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}"
    
    class Config:
        env_file = "../.env"
        env_file_encoding = 'utf-8'
        case_sensitive = False
        extra = "ignore"


settings = Settings()


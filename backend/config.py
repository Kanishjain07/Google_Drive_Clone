from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional

class Settings(BaseSettings):
    # Supabase Configuration
    supabase_url: str = Field(default="your_supabase_url_here", env="SUPABASE_URL")
    supabase_key: str = Field(default="your_supabase_anon_key_here", env="SUPABASE_KEY")

    # JWT
    secret_key: str = Field(default="your-secret-key-here-change-in-production", env="SECRET_KEY")
    algorithm: str = Field(default="HS256", env="ALGORITHM")
    access_token_expire_minutes: int = Field(default=30, env="ACCESS_TOKEN_EXPIRE_MINUTES")

    # Server
    host: str = Field(default="0.0.0.0", env="HOST")
    port: int = Field(default=8000, env="PORT")

    # CORS
    frontend_url: str = Field(default="http://localhost:3000", env="FRONTEND_URL")

    class Config:
        env_file = ".env"

settings = Settings()

#!/usr/bin/env python3
"""
Startup script for Google Drive Clone Backend
"""

import uvicorn
from config import settings

if __name__ == "__main__":
    print("🚀 Starting Google Drive Clone Backend...")
    print(f"📍 Server will run on http://{settings.host}:{settings.port}")
    print(f"📚 API Documentation: http://{settings.host}:{settings.port}/docs")
    print("=" * 50)
    
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
        log_level="info"
    )

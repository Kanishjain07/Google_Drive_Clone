from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
import auth, files, folders

# Create FastAPI app
app = FastAPI(
    title="Google Drive Clone API",
    description="A complete Google Drive clone backend with authentication, file management, and folder organization",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url, 
        "http://localhost:3000",
        "http://localhost:3001",
        "https://" + settings.frontend_url if not settings.frontend_url.startswith("http") else settings.frontend_url
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(files.router, prefix="/files", tags=["Files"])
app.include_router(folders.router, prefix="/folders", tags=["Folders"])

@app.get("/")
def root():
    return {
        "message": "Google Drive Clone API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )

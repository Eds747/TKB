#!/usr/bin/env python3
import os
import sys
import uvicorn

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import the FastAPI app
from backend.app import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    
    print(f"Starting YHWH Knowledge Base on {host}:{port}")
    
    uvicorn.run(
        "backend.app:app",
        host=host,
        port=port,
        log_level="info"
    )

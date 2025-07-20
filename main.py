#!/usr/bin/env python3
"""
YHWH Knowledge Base - Azure Entry Point
Simple main.py file for Azure App Service deployment
"""
import os
import sys
from pathlib import Path

# Ensure we can import our backend module
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

print("=== YHWH Knowledge Base Starting ===")
print(f"Python version: {sys.version}")
print(f"Working directory: {current_dir}")
print(f"Python path: {sys.path[0]}")

try:
    # Import the FastAPI application
    from backend.app import app
    print("✅ FastAPI app imported successfully")
    
    if __name__ == "__main__":
        import uvicorn
        
        # Get port from environment (Azure sets HTTP_PLATFORM_PORT)
        port = int(os.environ.get("PORT", os.environ.get("HTTP_PLATFORM_PORT", 8000)))
        host = "0.0.0.0"
        
        print(f"🚀 Starting server on {host}:{port}")
        
        # Start the server
        uvicorn.run(
            app, 
            host=host, 
            port=port,
            log_level="info"
        )

except ImportError as e:
    print(f"❌ Failed to import FastAPI app: {e}")
    print("Available files in current directory:")
    for item in current_dir.iterdir():
        print(f"  {item}")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error starting server: {e}")
    sys.exit(1)

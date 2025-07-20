#!/usr/bin/env python3
"""
Azure App Service entry point for YHWH Knowledge Base
This file MUST be in the root directory for Azure to find it
"""

if __name__ == "__main__":
    print("=== Azure Startup Script ===")
    
    import os
    import sys
    from pathlib import Path
    
    # Print environment info for debugging
    print(f"Python version: {sys.version}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Python path: {sys.path}")
    print(f"Environment variables:")
    for key, value in os.environ.items():
        if 'PORT' in key or 'PYTHON' in key or 'SITE' in key:
            print(f"  {key}: {value}")
    
    # List all files to see what's available
    print("Files in current directory:")
    for item in Path(".").iterdir():
        print(f"  {item}")
    
    try:
        # Import the FastAPI app from backend directory
        from backend.app import app
        print("✅ Successfully imported FastAPI app")
        
        import uvicorn
        
        # Azure sets HTTP_PLATFORM_PORT, fallback to PORT, then 8000
        port = int(os.environ.get("HTTP_PLATFORM_PORT", 
                  os.environ.get("PORT", "8000")))
        host = "0.0.0.0"
        
        print(f"🚀 Starting YHWH Knowledge Base server on {host}:{port}")
        
        # Start uvicorn server
        uvicorn.run(
            app,
            host=host,
            port=port,
            log_level="info",
            access_log=True
        )
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Available Python modules:")
        import pkgutil
        for importer, modname, ispkg in pkgutil.iter_modules():
            print(f"  {modname}")
        sys.exit(1)
        
    except Exception as e:
        print(f"❌ Startup error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

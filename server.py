#!/usr/bin/env python3
import os
import sys
import uvicorn

# Add current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Remove any README files that might interfere
readme_files = ['README.md', 'readme.md', 'Readme.md']
for readme in readme_files:
    try:
        if os.path.exists(readme):
            os.remove(readme)
            print(f"Removed {readme} to prevent conflicts")
    except:
        pass

print("=== YHWH Knowledge Base Server Starting ===")
print(f"Python version: {sys.version}")
print(f"Working directory: {os.getcwd()}")
print(f"Available files: {os.listdir('.')}")

# Import the FastAPI app
try:
    from backend.app import app
    print("✅ FastAPI app imported successfully")
except ImportError as e:
    print(f"❌ Error importing FastAPI app: {e}")
    sys.exit(1)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    
    print(f"🚀 Starting YHWH Knowledge Base on {host}:{port}")
    
    # Force the application to start and prevent README serving
    uvicorn.run(
        app,  # Pass the app directly instead of string reference
        host=host,
        port=port,
        log_level="info",
        access_log=True
    )

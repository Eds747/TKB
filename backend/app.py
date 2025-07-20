from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import json
from pathlib import Path
import glob

app = FastAPI(title="YHWH Knowledge Base API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files (for serving frontend)
app.mount("/static", StaticFiles(directory="frontend"), name="static")

# Data directory paths - Use both local data and original alimentacion
DATA_DIR = Path("backend/data")  # Local data directory for Azure
ALIMENTACION_DIR = Path(r"C:\Users\chris\Downloads\alimentacion")  # Original source

def load_json_file(file_path: Path):
    """Load JSON file with error handling"""
    try:
        if not file_path.exists():
            return {"error": f"File {file_path.name} not found"}
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return {"error": f"Error loading {file_path.name}: {str(e)}"}

@app.get("/")
def serve_frontend():
    """Serve the main HTML page"""
    try:
        return FileResponse("frontend/index.html")
    except Exception as e:
        return {"error": "Frontend not found", "details": str(e)}

@app.get("/api/data")
def get_all_data():
    """Get all knowledge base data"""
    data = {}
    
    # Try to load from both DATA_DIR and ALIMENTACION_DIR
    directories = [DATA_DIR, ALIMENTACION_DIR]
    
    for directory in directories:
        if directory.exists():
            json_files = list(directory.glob("*.json"))
            for file_path in json_files:
                file_name = file_path.stem
                if file_name not in data:  # Don't overwrite if already loaded
                    data[file_name] = load_json_file(file_path)
            break  # Use first available directory
    
    # If no data found, return fallback data
    if not data:
        data = {
            "error": "No data files found",
            "available_paths": [str(d) for d in directories],
            "fallback": "Using default data"
        }
    
    return data

@app.get("/api/appointments")
def get_appointments():
    """Get appointment guide data"""
    # Try both directories
    for directory in [DATA_DIR, ALIMENTACION_DIR]:
        file_path = directory / "appointment_guide.json"
        if file_path.exists():
            return load_json_file(file_path)
    
    return {"error": "appointment_guide.json not found", "available_dirs": [str(DATA_DIR), str(ALIMENTACION_DIR)]}

@app.get("/api/information")
def get_information():
    """Get general information including HIPAA, prescriptions, etc."""
    # Try both directories
    for directory in [DATA_DIR, ALIMENTACION_DIR]:
        file_path = directory / "information.json"
        if file_path.exists():
            return load_json_file(file_path)
    
    return {"error": "information.json not found", "available_dirs": [str(DATA_DIR), str(ALIMENTACION_DIR)]}

@app.get("/api/staff")
def get_staff_extensions():
    """Get staff extensions"""
    # Try both directories
    for directory in [DATA_DIR, ALIMENTACION_DIR]:
        file_path = directory / "staff_extensions.json"
        if file_path.exists():
            return load_json_file(file_path)
    
    return {"error": "staff_extensions.json not found", "available_dirs": [str(DATA_DIR), str(ALIMENTACION_DIR)]}

@app.get("/api/insurance")
def get_insurance_portals():
    """Get insurance portals information"""
    # Try both directories
    for directory in [DATA_DIR, ALIMENTACION_DIR]:
        file_path = directory / "insurance_portals.json"
        if file_path.exists():
            return load_json_file(file_path)
    
    return {"error": "insurance_portals.json not found", "available_dirs": [str(DATA_DIR), str(ALIMENTACION_DIR)]}

@app.get("/api/callflow")
def get_callflow():
    """Get callflow information"""
    # Try both directories
    for directory in [DATA_DIR, ALIMENTACION_DIR]:
        file_path = directory / "callflow_corrected.json"
        if file_path.exists():
            return load_json_file(file_path)
    
    return {"error": "callflow_corrected.json not found", "available_dirs": [str(DATA_DIR), str(ALIMENTACION_DIR)]}

@app.get("/api/categories")
def get_categories():
    """Get available categories"""
    return {
        "categories": [
            {"id": "appointments", "name": "Appointment Guide", "icon": "📅"},
            {"id": "information", "name": "General Information", "icon": "ℹ️"},
            {"id": "staff", "name": "Staff Extensions", "icon": "👥"},
            {"id": "insurance", "name": "Insurance Portals", "icon": "🏥"},
            {"id": "callflow", "name": "Call Flow", "icon": "📞"}
        ]
    }

@app.get("/api/updates")
def get_updates():
    """Get recent updates for the dashboard card"""
    return {
        "updates": [
            {
                "title": "New HIPAA Guidelines",
                "description": "Updated privacy and security policies effective immediately",
                "date": "2025-01-20",
                "priority": "high",
                "category": "compliance"
            },
            {
                "title": "Staff Extension Changes",
                "description": "Several staff members have new extension numbers",
                "date": "2025-01-18",
                "priority": "medium", 
                "category": "staff"
            },
            {
                "title": "New Insurance Portal",
                "description": "Added Magnacare portal information for verification",
                "date": "2025-01-15",
                "priority": "low",
                "category": "insurance"
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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

# Data directory paths
DATA_DIR = Path("backend/data")
ALIMENTACION_DIR = Path(r"C:\Users\chris\Downloads\alimentacion")

def load_json_file(file_path: Path):
    """Load JSON file with error handling"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading {file_path.name}: {str(e)}")

@app.get("/")
def root():
    return {"message": "YHWH Knowledge Base API", "status": "active"}

@app.get("/api/data")
def get_all_data():
    """Get all knowledge base data"""
    data = {}
    
    # Load data from alimentacion folder
    json_files = glob.glob(str(ALIMENTACION_DIR / "*.json"))
    
    for file_path in json_files:
        file_name = Path(file_path).stem
        try:
            data[file_name] = load_json_file(Path(file_path))
        except Exception as e:
            data[file_name] = {"error": str(e)}
    
    return data

@app.get("/api/appointments")
def get_appointments():
    """Get appointment guide data"""
    return load_json_file(ALIMENTACION_DIR / "appointment_guide.json")

@app.get("/api/information")
def get_information():
    """Get general information including HIPAA, prescriptions, etc."""
    return load_json_file(ALIMENTACION_DIR / "information.json")

@app.get("/api/staff")
def get_staff_extensions():
    """Get staff extensions"""
    return load_json_file(ALIMENTACION_DIR / "staff_extensions.json")

@app.get("/api/insurance")
def get_insurance_portals():
    """Get insurance portals information"""
    return load_json_file(ALIMENTACION_DIR / "insurance_portals.json")

@app.get("/api/callflow")
def get_callflow():
    """Get callflow information"""
    return load_json_file(ALIMENTACION_DIR / "callflow_corrected.json")

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

from pydantic import BaseModel, ValidationError
from typing import List, Optional

class Article(BaseModel):
    title: str
    content: str
    category: Optional[str] = None
    priority: Optional[str] = "low"

class VisitType(BaseModel):
    visit_type: str
    description: str
    duration: str
    extra_info: Optional[str] = ""
    rules: Optional[str] = ""

class StaffMember(BaseModel):
    Staff: str
    Ext: str

class Insurance(BaseModel):
    insurance_name: str
    portal_name: str
    website: str
    pcp_change_required: bool
    notes: Optional[str] = ""

class Update(BaseModel):
    title: str
    description: str
    date: str
    priority: str
    category: str

def validate_article(data):
    """Validate article data"""
    try:
        return Article(**data)
    except ValidationError as e:
        return {"error": str(e)}

def validate_visit_type(data):
    """Validate visit type data"""
    try:
        return VisitType(**data)
    except ValidationError as e:
        return {"error": str(e)}

def validate_staff_member(data):
    """Validate staff member data"""
    try:
        return StaffMember(**data)
    except ValidationError as e:
        return {"error": str(e)}

def validate_insurance(data):
    """Validate insurance data"""
    try:
        return Insurance(**data)
    except ValidationError as e:
        return {"error": str(e)}

def validate_update(data):
    """Validate update data"""
    try:
        return Update(**data)
    except ValidationError as e:
        return {"error": str(e)}

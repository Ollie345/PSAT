from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional
import uvicorn
from datetime import datetime
from assessment_logic import MenopauseAssessmentBot

app = FastAPI(title="Health Assessment API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class HealthAssessment(BaseModel):
    name: str
    email: EmailStr
    age: int
    marital_status: str
    hot_flashes: Optional[str] = ""
    irregular_periods: Optional[str] = ""
    sleep_issues: Optional[str] = ""
    mood_changes: Optional[str] = ""
    vaginal_dryness: Optional[str] = ""
    libido_changes: Optional[str] = ""
    memory_focus: Optional[str] = ""
    weight_changes: Optional[str] = ""
    hair_changes: Optional[str] = ""
    joint_pain: Optional[str] = ""

class AssessmentResponse(BaseModel):
    success: bool
    message: str
    score: int
    stage: str
    detailed_message: str
    assessment_id: Optional[str] = None

# In-memory storage
assessments_db = []
assessment_bot = MenopauseAssessmentBot()

@app.get("/")
async def root():
    return {"message": "Health Assessment API is running"}

@app.post("/api/submit-assessment", response_model=AssessmentResponse)
async def submit_assessment(assessment: HealthAssessment):
    try:
        # Validate that at least one health question is answered
        health_responses = {
            "hot_flashes": assessment.hot_flashes,
            "irregular_periods": assessment.irregular_periods,
            "sleep_issues": assessment.sleep_issues,
            "mood_changes": assessment.mood_changes,
            "vaginal_dryness": assessment.vaginal_dryness,
            "libido_changes": assessment.libido_changes,
            "memory_focus": assessment.memory_focus,
            "weight_changes": assessment.weight_changes,
            "hair_changes": assessment.hair_changes,
            "joint_pain": assessment.joint_pain
        }
        
        answered_questions = [q for q in health_responses.values() if q and q.strip()]
        
        if len(answered_questions) == 0:
            raise HTTPException(
                status_code=400, 
                detail="Please answer at least one health question"
            )
        
        # Calculate score using the assessment bot
        total_score = assessment_bot.calculate_score(health_responses)
        assessment_result = assessment_bot.generate_assessment(total_score, assessment.age)
        
        # Create assessment record
        assessment_record = {
            "id": f"assessment_{len(assessments_db) + 1}",
            "timestamp": datetime.now().isoformat(),
            "data": assessment.dict(),
            "score": total_score,
            "result": assessment_result
        }
        
        # Store assessment
        assessments_db.append(assessment_record)
        
        print(f"New assessment submitted:")
        print(f"  Name: {assessment.name}")
        print(f"  Age: {assessment.age}")
        print(f"  Score: {total_score}/18")
        print(f"  Stage: {assessment_result['stage']}")
        
        return AssessmentResponse(
            success=True,
            message=assessment_result['message'],
            score=total_score,
            stage=assessment_result['stage'],
            detailed_message=assessment_result['detailed_message'],
            assessment_id=assessment_record['id']
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing assessment: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/assessments")
async def get_assessments():
    """Get all assessments (for admin purposes)"""
    return {
        "total_assessments": len(assessments_db),
        "assessments": assessments_db
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    print("Starting Health Assessment API server...")
    print("API will be available at: http://localhost:8000")
    print("API docs available at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)

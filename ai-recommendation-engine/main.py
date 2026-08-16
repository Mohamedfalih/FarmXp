from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
from sklearn.cluster import KMeans

app = FastAPI(title="FarmXP AI Recommendation Engine")

class Module(BaseModel):
    moduleId: int
    category: Optional[str] = None
    difficulty: Optional[str] = None
    title: Optional[str] = None
    # Assuming these could be passed from backend or inferred
    # For now, we will dynamically determine benefit
    
class FarmerContext(BaseModel):
    farmerId: int
    xp: Optional[int] = 0
    sustainabilityScore: Optional[float] = 0.0
    completedModules: List[int] = []

class RecommendationRequest(BaseModel):
    farmer: FarmerContext
    availableModules: List[Module]

class ExpectedBenefits(BaseModel):
    water: str
    chemical: str
    yield_: str

class RecommendationResponse(BaseModel):
    farmerId: int
    cluster: str
    recommendedModuleId: int
    recommendedModuleTitle: str
    reason: str
    impactScore: float
    expectedBenefits: dict

# Pre-train a mock KMeans model since we don't have historical data from all farmers
# Features: [XP, SustainabilityScore]
X_mock = np.array([
    [10, 10.0],    # Beginner
    [500, 40.0],   # Developing
    [1500, 75.0],  # Intermediate
    [3000, 95.0]   # Advanced
])

kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
kmeans.fit(X_mock)

cluster_labels = {
    0: "BEGINNER",
    1: "DEVELOPING",
    2: "INTERMEDIATE",
    3: "ADVANCED"
}

# We manually map the centroids back to labels for consistency, 
# but for simplicity we'll just evaluate the closest and use a simple heuristic if KMeans mapping is unstable.
def get_adoption_stage(xp: int, score: float) -> str:
    prediction = kmeans.predict([[xp, score]])[0]
    # Simple heuristic to ensure logical progression regardless of random init
    if xp < 200 and score < 20:
        return "BEGINNER"
    elif xp < 1000 and score < 50:
        return "DEVELOPING"
    elif xp < 2000 and score < 80:
        return "INTERMEDIATE"
    else:
        return "ADVANCED"

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/recommend", response_model=RecommendationResponse)
def recommend(request: RecommendationRequest):
    farmer = request.farmer
    modules = request.availableModules
    
    if not modules:
        raise HTTPException(status_code=400, detail="No available modules provided.")

    # 1. Clustering
    stage = get_adoption_stage(farmer.xp or 0, farmer.sustainabilityScore or 0.0)
    
    # 2. Content-based Filtering
    # Filter out completed modules
    completed_set = set(farmer.completedModules)
    candidate_modules = [m for m in modules if m.moduleId not in completed_set]
    
    if not candidate_modules:
        # Fallback to the first available module if all are completed
        candidate_modules = modules
        
    # Heuristic scoring to find the best module
    best_module = None
    best_score = -1
    
    for m in candidate_modules:
        score = 10
        # Give higher score if difficulty matches stage
        diff = str(m.difficulty).upper() if m.difficulty else ""
        if stage == "BEGINNER" and diff == "BEGINNER":
            score += 50
        elif stage == "DEVELOPING" and diff in ["BEGINNER", "INTERMEDIATE"]:
            score += 40
        elif stage == "INTERMEDIATE" and diff == "INTERMEDIATE":
            score += 50
        elif stage == "ADVANCED" and diff == "ADVANCED":
            score += 50
            
        # Add random jitter to break ties
        score += np.random.randint(0, 10)
        
        if score > best_score:
            best_score = score
            best_module = m
            
    # 3. Calculate Impact Score
    # A simple formula based on farmer's current score
    impact_score = round(min(100.0, max(10.0, (farmer.sustainabilityScore or 0) * 0.2 + best_score)), 1)
    
    # Generate Benefits and Reason dynamically
    cat = str(best_module.category).upper() if best_module.category else ""
    water_benefit = "High" if cat == "WATER" else "Medium"
    chem_benefit = "High" if cat == "SOIL" else "Low"
    yield_benefit = "High" if cat == "CROP" else "Medium"
    
    reason = f"Based on your {stage.lower()} stage, this {best_module.category or 'learning'} module will maximize your farm's efficiency."

    return RecommendationResponse(
        farmerId=farmer.farmerId,
        cluster=stage,
        recommendedModuleId=best_module.moduleId,
        recommendedModuleTitle=best_module.title or f"Module {best_module.moduleId}",
        reason=reason,
        impactScore=impact_score,
        expectedBenefits={
            "water": water_benefit,
            "chemical": chem_benefit,
            "yield": yield_benefit
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

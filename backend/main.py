# pip install fastapi uvicorn joblib pydantic
import joblib
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import re

app = FastAPI()

# load
vect = joblib.load('artifacts/tfidf_vectorizer.joblib')
model = joblib.load('artifacts/logreg_model.joblib')

# small risky keywords list (extendable)
RISKY_KEYWORDS = [
    'wire transfer','urgent','no experience','quick money','pay to start','processing fee','investment'
]

class PredictRequest(BaseModel):
    text: str

class PredictResponse(BaseModel):
    fraud_prob: float
    label: int
    risky_keywords: List[str]


def find_keywords(text):
    found = set()
    t = text.lower()
    # naive matching; improve with phrases
    for kw in RISKY_KEYWORDS:
        if kw in t:
            found.add(kw)
    # also simple regex token matching for phrases
    return list(found)

@app.post('/predict', response_model=PredictResponse)
async def predict(req: PredictRequest):
    text = req.text or ''
    clean = re.sub(r"\s+", ' ', text.lower())
    X = vect.transform([clean])
    prob = float(model.predict_proba(X)[0][1])
    label = int(model.predict(X)[0])
    keywords = find_keywords(text)
    return { 'fraud_prob': prob, 'label': label, 'risky_keywords': keywords }

# Health
@app.get('/health')
async def health():
    return {'status':'ok'}
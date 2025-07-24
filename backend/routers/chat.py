from fastapi import APIRouter
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from backend.models.session import Session, Messsage
import uuid
from fastapi import HTTPException
from typing import Dict
import json


load_dotenv()
sessions={}

router=APIRouter()
client=OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def score_message(ai_text: str)-> Dict[str,int]:
    scoring_prompt=f"""
    You are an evaluator scoring a newly implemented AI's response.

    AI response: "{ai_text}"
    Please score the response from 1 to 5 (5 is the best) for each of the following traits:
    - Empathy
    - Clarity
    - Helpfulness 
    Return your answer as JSON like this:
    {{
    "empathy": 4,
    "calrity": 5,
    "helpfulness": 4
    }}
    """
    response=client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": scoring_prompt}],
        temperature=0.3
    )
    try: 
        parsed=json.loads(response.choices[0].message.content)
        return parsed
    except Exception as e:
        print ('Scoring parse error', e)
        return {}


class ChatRequest(BaseModel):
    message: str
    persona: str
    scenario: str
    session_id: str= None

class FeedbackRequest(BaseModel):
    session_id: str
    message_index: int 
    feedback: str


@router.post("/chat")
def chat(request: ChatRequest):
    if not request.session_id or request.session_id not in sessions:
        request.session_id = str(uuid.uuid4())
        sessions[request.session_id]=Session(
            id=request.session_id,
            persona=request.persona,
            scenario=request.scenario,
            messages=[]
        )
    prompt= f"You are a {request.persona} customer support agent helping with:{request.scenario}. The customer said: {request.message}"

    response=client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": request.message}
        ])
    reply=response.choices[0].message.content
    session=sessions[request.session_id]
    session.messages.append(Messsage(sender="user", text=request.message))
    scores=score_message(reply)
    session.messages.append(Messsage(sender="ai", text=reply, scores=scores))
    return {"reply": reply,
            "session_id":request.session_id,
            "scores": scores}



@router.get("/sessions")
def get_sessions():
    return list(sessions.values())


@router.post("/feedback")
def give_feedback(req: FeedbackRequest):
    session=sessions.get(req.session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    try:
        msg=session.messages[req.message_index]
        if msg.sender!="ai":
            raise HTTPException(status_code=400, detail="can Only rate AI messges")
        msg.feedback=req.feedback
        return{"status": "success"}
    except IndexError:
        raise HTTPException(status_code=400, detail="Invalid messge Index")
    
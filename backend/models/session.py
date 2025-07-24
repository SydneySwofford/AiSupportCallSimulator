from pydantic import BaseModel
from typing import List

class Messsage(BaseModel):
    sender: str
    text: str
    feedback: str | None =None 
    scores: dict| None=None 

class Session(BaseModel):
    id:str
    persona:str
    scenario:str
    messages: List[Messsage]
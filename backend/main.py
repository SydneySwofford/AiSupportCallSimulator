from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import chat

app=FastAPI()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["http://localhost:3000"],
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)

@app.get("/")
def read_root():
    return {"message": "backend is running"}


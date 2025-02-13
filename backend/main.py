from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

DATA_FILE = "data.json"

class Scene(BaseModel):
    id: int
    name: str
    duration: int

class Transition(BaseModel):
    from_: str
    to: str
    duration: int

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as file:
            return json.load(file)
    return {"scenes": [], "transitions": []}

def save_data(data):
    with open(DATA_FILE, "w") as file:
        json.dump(data, file)

data = load_data()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Show Planner API"}

@app.get("/data")
def get_data():
    return data

@app.post("/update")
def update_data(new_data: dict):
    global data

    if "scenes" not in new_data or "transitions" not in new_data:
        raise HTTPException(status_code=400, detail="Invalid data format")

    data = {
        "scenes": [Scene(**scene).dict() for scene in new_data["scenes"]],
        "transitions": [
            {"from_": t["from"], "to": t["to"], "duration": t["duration"]}
            for t in new_data["transitions"]
        ],
    }

    save_data(data)

    return {"message": "Data updated successfully!", "scenes": data["scenes"], "transitions": data["transitions"]}
#Todo List

#Imports
from typing import Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from tkinter import *

#Use FastApi
app = FastAPI()

#idk
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Class Appointment
class Appointment(BaseModel):
    title: str
    description: str
    completed: bool
    due_date: str
    
todo_list: Dict[int, Appointment] = {}

#Greeting Site
@app.get("/")
async def root():
    return {"message": "Hey, this is my simple Todo List Project 2023, hope it works :)"}

#The list of all appointments
@app.get("/appointments")
async def read_appointments():
    return todo_list

#Create new appointment
@app.post("/appointments")
async def create_appointment(appointment: Appointment):
        
    appointment_id = 0
    if len(todo_list) == 0:
        appointment_id = 1
    else:
        appointment_id = max(todo_list.keys()) + 1
    todo_list[appointment_id] = appointment
    
    with open('appointments.txt', 'w+') as appointments_list_file:
        appointments_list_file.write(f'{todo_list}')
    
    return {"appointment_id": appointment_id}

#update an appointment
@app.put("/appointments/{appointment_id}")
async def update_appointment(appointment_id: int, appointment:Appointment):
    if appointment_id not in todo_list:
        return {"error": "Appointment not found"}
        
    todo_list[appointment_id] = appointment
        
    with open('appointments.txt', 'w+') as appointments_list_file:
        appointments_list_file.write(f"{todo_list}")
        
        #return {"message": "Appointment updated successfully"}
        
    return {"appointment_id": appointment_id}

#delete an appointment
@app.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id:int):
    if appointment_id not in todo_list:
        return {"error": "Appointment not found"}
    
    del todo_list[appointment_id]
        
    with open('appointments.txt', 'w+') as appointments_list_file:
        appointments_list_file.write(f"{todo_list}")
    return {"message":"Appointment deleted"}

if __name__ == "__main__":
    uvicorn.run("main:app",
                host='127.0.0.1',
                port=4557,
                reload=True,
                log_level="info")
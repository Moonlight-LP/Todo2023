#Todo List

#Imports
import json
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

# load all appointments in the text file into the todo_list data structure


@app.on_event("startup")
def load_appointments():
    '''Load all appointments'''
    with open('appointments.txt', 'r') as appointments_list_file:
        data = appointments_list_file.read()
        if data:
            todo_list.update(json.loads(data))

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
        
    appointment_id = str(len(todo_list) + 1)
    
    todo_list[appointment_id] = appointment
    
    with open('appointments.txt', 'w+') as appointments_list_file:
        appointments_list_file.write(json.dumps(todo_list, default=lambda o: o.__dict__, sort_keys=True, indent=4))
    
    return {"appointment_id": appointment_id}

#update an appointment
@app.put("/appointments/{appointment_id}")
async def update_appointment(appointment_id: int, appointment:Appointment):
    if appointment_id not in todo_list:
        return {"error": "Appointment not found"}
        
    todo_list[appointment_id] = appointment
        
    with open('appointments.txt', 'w+') as appointments_list_file:
        appointments_list_file.write(json.dumps(todo_list, default=lambda o: o.__dict__, sort_keys=True, indent=4))
        
        #return {"message": "Appointment updated successfully"}
        
    return {"appointment_id": appointment_id}

#delete an appointment
@app.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id:int):
    if appointment_id not in todo_list:
        return {"error": "Appointment not found"}
    
    del todo_list[appointment_id]
        
    with open('appointments.txt', 'w+') as appointments_list_file:
        appointments_list_file.write((json.dumps(todo_list, default=lambda o: o.__dict__, sort_keys=True, indent=4)))
    return {"message":"Appointment deleted"}

if __name__ == "__main__":
    uvicorn.run("main:app",
                host='127.0.0.1',
                port=4557,
                reload=True,
                log_level="info")
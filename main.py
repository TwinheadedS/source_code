from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np

app = FastAPI()

# Load models
house_model = pickle.load(open('models/house.pkl', 'rb'))
student_model = pickle.load(open('models/student.pkl', 'rb'))

# Define request model
class PredictionRequest(BaseModel):
    Rooms: int
    Postcode: str
    Bathroom: int
    Car: int
    Landsize: float
    Year: int
    Type: str

@app.post("/predict")
async def predict(request: PredictionRequest):
    # Convert request to DataFrame
    input_data = pd.DataFrame([request.dict()])
    
    # Predict student count
    student_count = student_model.predict([[request.Year]])[0]
    input_data['student_count'] = student_count

    # Create dummy variables for 'Type' column (adjust this to match your training data)
    input_data = pd.get_dummies(input_data, columns=['Type'], drop_first=True)

    # Ensure all columns expected by the model are present (fill missing ones with 0)
    expected_columns = house_model.feature_names_in_
    for col in expected_columns:
        if col not in input_data.columns:
            input_data[col] = 0  # or set an appropriate default value
    
    # Reorder columns to match the model’s expected input
    input_data = input_data[expected_columns]

    try:
        # Predict house price
        predicted_price = house_model.predict(input_data)[0]
        return {"predicted_price": predicted_price}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

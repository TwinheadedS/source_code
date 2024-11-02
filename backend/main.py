from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)

# Create the FastAPI app
app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models with error handling
try:
    house_model = pickle.load(open('models/house.pkl', 'rb'))
    logging.info("House model loaded successfully.")
except (FileNotFoundError, pickle.UnpicklingError) as e:
    logging.error(f"Error loading house model: {e}")
    raise HTTPException(status_code=500,
                        detail="House model could not be loaded.")

try:
    student_model = pickle.load(open('models/student.pkl', 'rb'))
    logging.info("Student model loaded successfully.")
except (FileNotFoundError, pickle.UnpicklingError) as e:
    logging.error(f"Error loading student model: {e}")
    raise HTTPException(status_code=500,
                        detail="Student model could not be loaded.")


# Define the request model
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
    try:
        # Log incoming request data
        logging.info(f"Received input data: {request.dict()}")

        input_data = pd.DataFrame([request.dict()])
        student_count = student_model.predict([[request.Year]])[0]
        input_data['student_count'] = student_count

        input_data = pd.get_dummies(input_data,
                                    columns=['Type'],
                                    drop_first=True)

        expected_columns = house_model.feature_names_in_
        for col in expected_columns:
            if col not in input_data.columns:
                logging.warning(
                    f"Missing column {col} in input data. Filling with 0.")
                input_data[col] = 0

        input_data = input_data[expected_columns]

        predicted_price = house_model.predict(input_data)[0]
        logging.info(f"Predicted house price: {predicted_price}")

        return {"predicted_price": predicted_price}
    except Exception as e:
        logging.error(f"Error during prediction: {e}")
        raise HTTPException(status_code=400,
                            detail=f"An error occurred: {str(e)}")

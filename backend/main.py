from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import logging
from house_prediction import predict_house  # Importing the prediction function

# Set up logging for information and error messages
logging.basicConfig(level=logging.INFO)

# Create the FastAPI app instance
app = FastAPI()

# Add CORS middleware to allow requests from your front-end
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"
                   ],  # Adjust this to match your front-end URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define the request model using Pydantic for data validation
class PredictionRequest(BaseModel):
    Rooms: int  # Number of rooms in the house
    Postcode: str  # Postal code of the house location
    Bathroom: int  # Number of bathrooms
    Car: int  # Number of car spaces
    Landsize: float  # Size of the land in square meters
    Year: int  # Year of interest for prediction
    Type: str  # Type of house (e.g., 'h', 'u', 't')


@app.post("/predict")
async def predict(request: PredictionRequest):
    try:
        # Map the request data to the format expected by house_prediction.py
        features_to_predict = {
            'Rooms': request.Rooms,
            'Postcode': request.Postcode,
            'Bathroom': request.Bathroom,
            'Car': request.Car,
            'Landsize': request.Landsize,
            'Year': request.Year,
            'Type': request.Type,
        }

        # Call the predict_house function and get the result
        predicted_price = predict_house(features_to_predict,
                                        plot=False,
                                        metrics=False)
        logging.info(f"Predicted house price: {predicted_price}")

        return {"predicted_price": float(predicted_price)}
    except Exception as e:
        logging.error(f"Error during prediction: {e}")
        raise HTTPException(
            status_code=400,
            detail=f"An error occurred during prediction: {str(e)}")

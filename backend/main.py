from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import logging
from house_prediction import predict_house, preprocess_student_data, create_student_prediction, STUDENT_PATH  # Ensure these imports are correct

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


@app.post("/predict_combined")
async def predict_combined(request: PredictionRequest):
    try:
        # Log the received request data
        logging.info(f"Received request data: {request.dict()}")

        # Prepare the features dictionary
        features = {
            'Rooms': request.Rooms,
            'Postcode': request.Postcode,
            'Bathroom': request.Bathroom,
            'Car': request.Car,
            'Landsize': request.Landsize,
            'Year': request.Year,
            'Type': request.Type,
        }

        # Preprocess student data and generate predictions up to the requested year
        student_data, student_scaler = preprocess_student_data(STUDENT_PATH)
        create_student_prediction(
            student_data,
            student_scaler,
            target=request.Year +
            5,  # Generate predictions up to 5 years after the input year
            return_per_year=True)

        # Predict for the input year and 5 years ahead
        start_year = request.Year
        end_year = start_year + 5

        # Call the unified prediction function
        prediction_years, predicted_prices, student_predictions, mse, rmse, mae, r2 = predict_house(
            features, plot=False, metrics=True, end_year=end_year)

        # Extract the single-year prediction (first year in the array)
        single_year_price = predicted_prices[0]

        # Prepare the response, including student predictions
        response = {
            "single_year_prediction": single_year_price,
            "multi_year_predictions": {
                "years": prediction_years,
                "prices": predicted_prices
            },
            "student_predictions": student_predictions,
            "metrics": {
                "mse": mse,
                "rmse": rmse,
                "mae": mae,
                "r2": r2
            }
        }

        logging.info(f"Response data: {response}")

        return response

    except Exception as e:
        logging.error(f"Error during combined prediction: {e}")
        raise HTTPException(status_code=400,
                            detail=f"An error occurred: {str(e)}")

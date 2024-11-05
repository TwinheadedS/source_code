from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
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
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define the request model using Pydantic for data validation
class PredictionRequest(BaseModel):
    Rooms: int = Field(gt=0, description="Number of rooms must be positive"
                       )  # Number of rooms in the house
    Postcode: str  # Postal code of the house location
    Bathroom: int = Field(
        ge=0, description="Number of bathrooms must be zero or positive"
    )  # Number of bathrooms
    Car: int = Field(
        ge=0, description="Number of car spaces must be zero or positive"
    )  # Number of car spaces
    Landsize: float = Field(gt=0, description="Landsize must be positive"
                            )  # Size of the land in square meters
    Year: int = Field(ge=2024,
                      le=2124,
                      description="Year must be within a reasonable range"
                      )  # Year of interest for prediction
    Type: str  # Type of house (e.g., 'h', 'u', 't')


@app.post("/predict_combined")
async def predict_combined(request: PredictionRequest):
    try:
        logging.info(f"Received request data: {request.dict()}")

        # Load and process student data
        student_data, student_scaler = preprocess_student_data(STUDENT_PATH)
        try:
            student_predictions = create_student_prediction(
                student_data,
                student_scaler,
                target=request.Year + 5,
                return_per_year=True)
        except Exception as e:
            logging.error("Error in creating student predictions", e)
            raise HTTPException(status_code=500,
                                detail="Failed to process student data.")

        # Prediction for the input year and 5 years ahead
        start_year = request.Year
        end_year = start_year + 5

        prediction_years, predicted_prices, _, mse, rmse, mae, r2 = predict_house(
            features=request.dict(),
            plot=False,
            metrics=True,
            end_year=end_year)

        # Construct response
        single_year_price = predicted_prices[0]
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

    except HTTPException as e:
        logging.error(f"HTTP error: {e.detail}")
        raise
    except Exception as e:
        logging.error(f"Unexpected error during combined prediction: {str(e)}")
        raise HTTPException(status_code=500,
                            detail="An internal error occurred.")


@app.get("/status")
async def status():
    """Endpoint to check if the API is running."""
    return {"status": "API is running"}

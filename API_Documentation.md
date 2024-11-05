# Housing Market Prediction API Documentation

This API is designed to provide housing price predictions and forecast the number of international students based on user input. The API leverages a machine learning model to produce accurate predictions and supports communication between the backend and frontend through JSON data.

## Base URL

- `http://localhost:8000`

## Endpoints

### 1. `/predict_combined` - POST

This endpoint processes the user input to generate predictions for housing prices and international student numbers for a specified year and the next five years.

#### Request

- **Method**: POST
- **Content-Type**: `application/json`

#### Request Body

The request body should contain the following fields as a JSON object:

| Field      | Type   | Description                                             | Constraints                                  |
|------------|--------|---------------------------------------------------------|----------------------------------------------|
| `Rooms`    | `int`  | Number of rooms in the house                            | Must be greater than 0                       |
| `Postcode` | `str`  | Postal code of the house location                       | No constraints                               |
| `Bathroom` | `int`  | Number of bathrooms                                     | Must be zero or positive                     |
| `Car`      | `int`  | Number of car spaces                                    | Must be zero or positive                     |
| `Landsize` | `float`| Size of the land in square meters                       | Must be greater than 0                       |
| `Year`     | `int`  | Year of interest for prediction                         | Between 2024 and 2124                        |
| `Type`     | `str`  | Type of house (e.g., 'h' for house, 'u' for unit, 't')  | Must be one of the predefined values         |

##### Example Request Body

```json
{
  "Rooms": 3,
  "Postcode": "3000",
  "Bathroom": 2,
  "Car": 1,
  "Landsize": 500,
  "Year": 2025,
  "Type": "h"
}


#### Response

The response includes a JSON object with the predicted single-year housing price, a five-year forecast for housing prices, international student predictions, and model metrics.

| Field                          | Type           | Description                                                                                             |
|--------------------------------|----------------|---------------------------------------------------------------------------------------------------------|
| `single_year_prediction`       | `float`        | Predicted housing price for the specified year                                                          |
| `multi_year_predictions`       | `object`       | Housing price predictions over the next five years                                                      |
| `multi_year_predictions.years` | `list[int]`    | List of years for the forecast                                                                          |
| `multi_year_predictions.prices`| `list[float]`  | Predicted housing prices for each year in the forecast                                                  |
| `student_predictions`          | `object`       | Predicted international student numbers for each year in the forecast                                   |
| `metrics`                      | `object`       | Metrics for model evaluation, including Mean Squared Error, Root Mean Squared Error, Mean Absolute Error, and R-squared values |

##### Example Response

```json
{
  "single_year_prediction": 2150000.0,
  "multi_year_predictions": {
    "years": [2025, 2026, 2027, 2028, 2029, 2030],
    "prices": [2150000.0, 2200000.0, 2250000.0, 2300000.0, 2350000.0, 2400000.0]
  },
  "student_predictions": {
    "2025": 198000.0,
    "2026": 197000.0,
    "2027": 195500.0,
    "2028": 194000.0,
    "2029": 192000.0,
    "2030": 190000.0
  },
  "metrics": {
    "mse": 1200000000.0,
    "rmse": 34600.0,
    "mae": 20000.0,
    "r2": 0.85
  }
}


#### Error Responses

The API may return the following error responses:

| HTTP Status | Description                            | Example Detail                                |
|-------------|----------------------------------------|-----------------------------------------------|
| `400`       | Bad request - invalid input parameters | `{"detail": "Landsize must be positive."}`    |
| `500`       | Internal Server Error                  | `{"detail": "An internal error occurred."}`   |

### Error Handling

- **Invalid Input**: If any input parameters are outside the specified constraints (e.g., `Landsize` is non-positive or `Year` is out of range), the API returns a `400` status with a descriptive error message.
- **Internal Errors**: If any unexpected issues occur, such as model or data processing errors, the API returns a `500` status with a generic error message.

---

### Logging

The backend application logs key activities and errors using Python's logging module. Key logs include:

1. **Request Data Logging**: Logs incoming request data for `POST /predict_combined`.
2. **Error Logging**: Logs error messages for both HTTP exceptions and unexpected errors.
3. **Response Logging**: Logs the data being returned to the client for tracking and debugging.

---

### Notes

- **Data Processing**: The backend integrates with a machine learning model for housing price prediction and international student forecasts.
- **AI Model Integration**: The backend calls a separate AI model to generate predictions based on user input and dynamically adjusts based on input parameters.
- **Dependencies**: Ensure all necessary dependencies are installed (e.g., `FastAPI`, `pydantic`, `pandas`, machine learning libraries).

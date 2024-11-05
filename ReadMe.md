
# Victoria Housing Market Prediction App

Welcome to the Victoria Housing Market Prediction App! This application predicts housing prices and forecasts market trends over the next five years based on user input. It utilizes a machine learning model on the back-end and displays interactive visualizations on the front-end.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Required Libraries](#required-libraries)
- [Running Instructions](#running-instructions)
  - [Front-End](#front-end)
  - [Back-End](#back-end)
- [AI Model Integration](#ai-model-integration)
- [Configuration Steps](#configuration-steps)
- [Usage](#usage)
- [License](#license)

## Prerequisites

- **Node.js** (v14 or higher)
- **Python** (v3.8 or higher)
- **npm** (comes with Node.js)
- **pip** (Python package installer)

## Project Structure

```
.
├── backend/
│   ├── main.py                # FastAPI entry point
│   ├── house_prediction.py     # Prediction logic or ML model integration
│   ├── data/
│   │   ├── melb_house_1.csv    # Dataset for housing data
│   │   └── vic_international_students.csv # Dataset for international students
│   └── models/
│       ├── house.pkl           # Serialized model file
│       └── house_True.pkl      # Another model variant
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MLTrainingLoader.js
│   │   │   ├── MultiYearPredictionChart.js
│   │   │   ├── PredictionChart.js
│   │   │   ├── StudentPredictionChart.js
│   │   │   └── UserInputForm.js
│   │   └── styles/
│   ├── public/
│   │   └── index.html
│   └── package.json
├── requirements.txt            # Backend dependencies
└── README.md
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/TwinheadedS/source_code.git
cd source_code
```

### 2. Setting Up the Back-End (FastAPI)

Navigate to the `backend` folder:

```bash
cd backend
```

1. Install the required libraries:
   ```bash
   pip install -r requirements.txt
   ```

### 3. Setting Up the Front-End (React)

Navigate to the `frontend` folder:

```bash
cd frontend
```

1. Install the required libraries:
   ```bash
   npm install
   ```

## Required Libraries

### Back-End (Python)

The following libraries are specified in `requirements.txt`:
- **FastAPI**: For creating the REST API.
- **Uvicorn**: ASGI server for FastAPI.
- **pandas**, **scikit-learn**: For data processing and machine learning.

### Front-End (React)

The following libraries are specified in `frontend/package.json`:
- **React**: For creating user interfaces.
- **axios**: For making HTTP requests to the back-end.
- **chart.js**: For data visualization in charts.

## Running Instructions

### Front-End

1. Open a terminal and navigate to the `frontend` folder.
2. Start the front-end application:
   ```bash
   npm start
   ```
3. The front-end should now be running on `http://localhost:3000`.

### Back-End

1. Open a new terminal and navigate to the `backend` folder.
2. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
3. The back-end should now be running on `http://localhost:8000`.

## AI Model Integration

The AI model used for predictions is implemented in `house_prediction.py` and saved as `house.pkl`. Ensure this file is loaded correctly for generating predictions.

## Configuration Steps (Can be skipped if no modifications is needed)

1. **Model File**: Place the `house.pkl` file in the `models` directory and load it within `house_prediction.py`.
2. **API Endpoint**: In `backend/main.py`, ensure there’s an endpoint that calls the model for predictions. Example:
   ```python
   from fastapi import FastAPI
   from house_prediction import predict_price

   app = FastAPI()

   @app.post("/predict")
   async def predict(data: dict):
       return predict_price(data)
   ```
3. **Frontend API URL**: Ensure the front-end makes requests to the back-end URL (e.g., `http://localhost:8000/predict`). Update any API URLs in `frontend/src` files if needed.

## Usage

1. Open the application at `http://localhost:3000`.
2. Enter the required details for a housing prediction.
3. Click **Submit** to receive a price prediction and market forecast.
4. View the prediction results and forecast on the displayed charts.

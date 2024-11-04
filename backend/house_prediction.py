# Importing Libraries

# Data Processing Libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler

# Training and Testing Libraries
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Model Libraries
from sklearn.svm import SVR
from sklearn.ensemble import RandomForestRegressor

import pickle

# Student parameters
STUDENT_PATH = "./data/vic_international_students.csv"
TARGET = 2999  # Last year of the prediction
NOW = 2024  # Last year of the dataset
PREDICTION_PATH = "predicted_students.csv"

# House parameters
HOUSE_PATH = "./data/melb_house_1.csv"


def preprocess_student_data(path):
    """
    This function will import the data and process it for training,
    it will also scale the data using MinMaxScaler for more accurate results.
    """
    student_df = pd.read_csv(path)

    scaler = MinMaxScaler()
    student_df["count_normalized"] = scaler.fit_transform(student_df[["count"
                                                                      ]])

    return student_df, scaler


def plot_result(true_X, true_y, X_pred, y_pred):
    """
    This function plots the result in a line graph format, comparing the real value
    and the predicted value for the student data
    """

    # Plot the True value
    plt.plot(true_X, true_y, color="blue", label="True values", marker="o")

    # Plot the Predicted values
    plt.plot(X_pred, y_pred, color="red", label="Predicted line")

    # Add labels and title
    plt.xlabel("X")
    plt.ylabel("Y")
    plt.title("Number of International Student Prediction")

    # Add legend
    plt.legend()

    # Show the plot
    plt.show()


def create_student_prediction(student_df,
                              scaler,
                              target,
                              plot=False,
                              return_per_year=False):
    """
    Generate predictions for the number of international students for each year up to the target year.
    Train the model using past data and append generated predictions dynamically.
    """
    # Initial training data
    stud_X = student_df[["year"]]
    stud_y = student_df["count_normalized"]

    new_X = stud_X.copy()
    new_y = stud_y.copy()

    yearly_predictions = {}

    for i in range(NOW + 1, target +
                   1):  # Start from the year after the last available year
        # Train the model on all data up to the current prediction year
        svr_model = SVR()
        svr_model.fit(new_X, new_y)

        # Prepare prediction for the current year
        pred = pd.DataFrame({'year': [i]})
        y_pred = svr_model.predict(pred)

        # Append the prediction to the training set for use in future years
        new_X.loc[len(new_X)] = [i]
        new_y.loc[len(new_y)] = y_pred

        # Collect the inverse-transformed prediction for the current year
        if return_per_year:
            yearly_predictions[i] = scaler.inverse_transform([[y_pred[0]]
                                                              ])[0][0]

    # Generate the final output for plotting or returning
    unscaled_y = scaler.inverse_transform([stud_y]).ravel()
    unscaled_y_pred = scaler.inverse_transform([new_y]).ravel()

    if plot:
        plot_result(stud_X, unscaled_y, new_X, unscaled_y_pred)

    result_df = pd.DataFrame({
        "year": new_X.squeeze(),
        "number_of_students": unscaled_y_pred
    })

    # Save predictions to CSV for use in house data processing
    result_df.to_csv(PREDICTION_PATH, index=False)

    # # Save the model if needed
    # with open('./models/student.pkl', 'wb') as f:
    #     pickle.dump(svr_model, f)

    return yearly_predictions if return_per_year else None


def preprocess_house_data(path):

    housing_df = pd.read_csv(path)  # Opening data

    # Dropping unused column
    columns_to_drop = [
        'Suburb', 'Address', 'Method', 'SellerG', 'Distance', 'Bedroom2',
        'CouncilArea', 'Lattitude', 'Longtitude', 'Regionname',
        'Propertycount', 'YearBuilt', 'BuildingArea'
    ]

    housing_df_cleaned = housing_df.drop(columns=columns_to_drop)

    housing_df_cleaned = housing_df_cleaned.dropna(
        subset=['Rooms', 'Price', 'Postcode', 'Bathroom'])

    # Filling NaN entries with 0 for the "Car" column
    housing_df_cleaned[['Car']] = housing_df_cleaned[['Car']].fillna(0)

    # Filling NaN with the mean of a specific postcode for the "Landsize" column
    mean_landsize_by_postcode = housing_df_cleaned.groupby(
        'Postcode')['Landsize'].transform('mean')
    housing_df_cleaned['Landsize'] = housing_df_cleaned['Landsize'].fillna(
        mean_landsize_by_postcode)

    # Dropping rows with NaN
    housing_df_cleaned = housing_df_cleaned.dropna()

    # Convertinf to a date_time format
    housing_df_cleaned['Date'] = pd.to_datetime(housing_df_cleaned['Date'],
                                                format="%d/%m/%Y")

    # Creating a "Year" Column
    housing_df_cleaned['Year'] = housing_df_cleaned['Date'].dt.year

    # Removing the original "Date" Column
    housing_df_cleaned = housing_df_cleaned.drop(columns=['Date'])

    # Encoding the "Type" column with One hot encoder
    housing_df_cleaned = pd.get_dummies(housing_df_cleaned, columns=['Type'])

    # Changing Postcode to type category
    housing_df_cleaned['Postcode'] = housing_df_cleaned['Postcode'].astype(
        'category')

    # Integrating the Student Model
    student_df = pd.read_csv(PREDICTION_PATH)

    # Merging the 2 files
    house_stud_df = housing_df_cleaned.merge(student_df,
                                             left_on='Year',
                                             right_on='year',
                                             how='left')

    # Dropping the duplicate "Year" Column
    house_stud_df = house_stud_df.drop(columns=['year'])

    # List of numerical columns to normalize
    columns_to_normalize = [
        'Rooms', 'Bathroom', 'Car', 'Landsize', 'Year', 'number_of_students'
    ]

    # Initialize the MinMaxScaler
    house_scaler = MinMaxScaler()

    # Fit the scaler to the numerical columns and transform them
    house_stud_df[columns_to_normalize] = house_scaler.fit_transform(
        house_stud_df[columns_to_normalize])

    return house_stud_df, house_scaler


def get_metrics(y_true, y_pred):
    # Calculate the metrics
    mse = mean_squared_error(y_true, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_pred=y_pred, y_true=y_true)

    # Print the metrics (useful for debugging and logs)
    print(f"Mean Squared Error (MSE): {mse}")
    print(f"Root Mean Squared Error (RMSE): {rmse}")
    print(f"Mean Absolute Error (MAE): {mae}")
    print(f"R-squared (R²): {r2}")

    # Return the metrics
    return mse, rmse, mae, r2


def train_house_model(house_stud_df, target_year, metrics=False):
    # Filter the data up to the target year
    house_stud_df_filtered = house_stud_df[house_stud_df['Year'] <=
                                           target_year]

    house_X = house_stud_df_filtered.drop(columns=['Price'])
    house_y = house_stud_df_filtered["Price"]

    X_train, X_valid, y_train, y_valid = train_test_split(house_X,
                                                          house_y,
                                                          test_size=0.2,
                                                          random_state=42)

    rvr_house = RandomForestRegressor()
    rvr_house.fit(X_train, y_train)
    y_pred = rvr_house.predict(X_valid)

    # # Save the trained model (optional if not needed for future use)
    # with open(f'./models/house_{target_year}.pkl', 'wb') as f:
    #     pickle.dump(rvr_house, f)

    if metrics:
        mse, rmse, mae, r2 = get_metrics(y_valid, y_pred)
        return rvr_house, mse, rmse, mae, r2

    return rvr_house, None, None, None, None


def predict_house(features, plot=False, metrics=False, end_year=None):
    """
    Predict house prices for a single year or multiple years based on user's own features.
    If end_year is provided, it will predict for the range from features['Year'] to end_year.
    """
    # Validate the type
    valid_types = ['h', 'u', 't']
    if features['Type'] not in valid_types:
        raise ValueError(
            f"Invalid property type '{features['Type']}'. Expected one of {valid_types}."
        )

    # Determine the prediction range
    start_year = features['Year']
    prediction_years = [start_year] if end_year is None else list(
        range(start_year, end_year + 1))

    # Preprocess student data and create predictions up to the max year
    max_year = max(prediction_years)
    student_data, student_scaler = preprocess_student_data(STUDENT_PATH)
    student_predictions = create_student_prediction(student_data,
                                                    student_scaler,
                                                    target=max_year,
                                                    plot=plot,
                                                    return_per_year=True)

    house_stud_df, house_scaler = preprocess_house_data(HOUSE_PATH)

    # Prepare predictions for each year in the prediction range
    predicted_prices = []
    for year in prediction_years:
        # Train a model specific to the target year
        rvr_house, mse, rmse, mae, r2 = train_house_model(house_stud_df,
                                                          target_year=year,
                                                          metrics=metrics)

        # Prepare features for the target year
        pred_features = pd.DataFrame({
            'Rooms': [features['Rooms']],
            'Postcode': [features['Postcode']],
            'Bathroom': [features['Bathroom']],
            'Car': [features['Car']],
            'Landsize': [features['Landsize']],
            'Year': [year],
            'Type_h': [features['Type'] == 'h'],
            'Type_t': [features['Type'] == 't'],
            'Type_u': [features['Type'] == 'u'],
        })

        # Integrate the student data for the specific year
        pred_features['number_of_students'] = [
            student_predictions[year] if year in student_predictions else 0
        ]

        # Normalize the prediction features
        columns_to_normalize = [
            'Rooms', 'Bathroom', 'Car', 'Landsize', 'Year',
            'number_of_students'
        ]
        pred_features[columns_to_normalize] = house_scaler.transform(
            pred_features[columns_to_normalize])

        print(
            f"[DEBUG] Multi-Year Prediction - Year {year} - pred_features:\n",
            pred_features)

        # Predict using the model for the current year
        house_pred = rvr_house.predict(pred_features)
        predicted_prices.append(house_pred[0])

    # Return results for single or multi-year predictions
    if end_year is None:
        return predicted_prices[0], mse, rmse, mae, r2
    else:
        return prediction_years, predicted_prices, student_predictions, mse, rmse, mae, r2


features_to_predict = {
    'Rooms': 3,
    'Postcode': '3000',
    'Bathroom': 2,
    'Car': 1,
    'Landsize': 500,
    'Year': 2030,
    'Type': 'h',
}

predicted_price = predict_house(features_to_predict, plot=False, metrics=True)

print(f"\nThe predicted price is : ${float(predicted_price[0]):.2f}\n")

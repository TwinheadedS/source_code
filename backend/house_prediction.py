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


def create_student_prediction(student_df, scaler, target, plot=False):
    '''
    
    '''
    stud_X = student_df[["year"]]
    stud_y = student_df["count_normalized"]

    new_X = stud_X.copy()
    new_y = stud_y.copy()

    svr_model = SVR()

    for i in range(NOW, target + 1):

        pred = pd.DataFrame({'year': [i]})

        svr_model.fit(new_X, new_y)
        y_pred = svr_model.predict(pred)
        new_X.loc[len(new_X)] = [i]
        new_y.loc[len(new_y)] = y_pred

    unscaled_y = scaler.inverse_transform([stud_y]).ravel()
    unscaled_y_pred = scaler.inverse_transform([new_y]).ravel()

    if plot:
        plot_result(stud_X, unscaled_y, new_X, unscaled_y_pred)

    result_df = pd.DataFrame({
        "year": new_X.squeeze(),
        "number_of_students": unscaled_y_pred
    })

    result_df.to_csv(PREDICTION_PATH, index=False)

    with open('./models/student.pkl', 'wb') as f:
        pickle.dump(svr_model, f)


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
    # Mean Squared Error (MSE)
    mse = mean_squared_error(y_true, y_pred)
    print(f"Mean Squared Error (MSE): {mse}")

    # Root Mean Squared Error (RMSE)
    rmse = np.sqrt(mse)
    print(f"Root Mean Squared Error (RMSE): {rmse}")

    # Mean Absolute Error (MAE)
    mae = mean_absolute_error(y_true, y_pred)
    print(f"Mean Absolute Error (MAE): {mae}")

    # R-squared (R²)
    r2 = r2_score(y_pred=y_pred, y_true=y_true)
    print(f"R-squared (R²): {r2}")


def train_house_model(house_stud_df, metrics):

    house_X = house_stud_df.drop(columns=['Price'])
    house_y = house_stud_df["Price"]

    X_train, X_valid, y_train, y_valid = train_test_split(house_X,
                                                          house_y,
                                                          test_size=0.2,
                                                          random_state=42)

    rvr_house = RandomForestRegressor()
    rvr_house.fit(X_train, y_train)
    y_pred = rvr_house.predict(X_valid)

    if metrics:
        get_metrics(y_valid, y_pred)

    with open('./models/house.pkl', 'wb') as f:
        pickle.dump(rvr_house, f)


def predict_house(features, plot, metrics):
    '''
    For predicting a single house price based on user's own features
    '''

    # Validate the type
    valid_types = ['h', 'u', 't']
    if features['Type'] not in valid_types:
        raise ValueError(
            f"Invalid property type '{features['Type']}'. Expected one of {valid_types}."
        )

    target = features['Year']

    student_data, student_scaler = preprocess_student_data(STUDENT_PATH)
    create_student_prediction(student_data,
                              student_scaler,
                              plot=plot,
                              target=target)
    house_stud_df, house_scaler = preprocess_house_data(HOUSE_PATH)
    train_house_model(house_stud_df, metrics)

    pred_features = pd.DataFrame({
        'Rooms': [features['Rooms']],
        'Postcode': [features['Postcode']],
        'Bathroom': [features['Bathroom']],
        'Car': [features['Car']],
        'Landsize': [features['Landsize']],
        'Year': [features['Year']],
        'Type_h': [False],
        'Type_t': [False],
        'Type_u': [False],
    })

    # Set the appropriate one-hot encoded type
    if features['Type'] == 'h':
        pred_features['Type_h'] = [True]
    elif features['Type'] == 'u':
        pred_features['Type_u'] = [True]
    elif features['Type'] == 't':
        pred_features['Type_t'] = [True]

    pred_student = pd.read_csv(PREDICTION_PATH)

    pred_features['number_of_students'] = [
        pred_student.loc[pred_student['year'] == features['Year'],
                         'number_of_students'].values[0]
    ]

    with open('./models/house.pkl', 'rb') as f:
        rvr_house = pickle.load(f)

    columns_to_normalize = [
        'Rooms', 'Bathroom', 'Car', 'Landsize', 'Year', 'number_of_students'
    ]
    pred_features[columns_to_normalize] = house_scaler.transform(
        pred_features[columns_to_normalize])

    house_pred = rvr_house.predict(pred_features)

    return house_pred


features_to_predict = {
    'Rooms': 3,
    'Postcode': '3000',
    'Bathroom': 2,
    'Car': 1,
    'Landsize': 500,
    'Year': 2030,
    'Type': 'h',
}

predicted_price = predict_house(features_to_predict, plot=True, metrics=True)

print(f"\nThe predicted price is : ${predicted_price[0]:.2f}\n")

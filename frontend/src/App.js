import React, { useState } from 'react';
import UserInputForm from './components/UserInputForm';
import PredictionChart from './components/PredictionChart';
import MultiYearPredictionChart from './components/MultiYearPredictionChart';
import StudentPredictionChart from './components/StudentPredictionChart';
import MLTrainingLoader from './components/MLTrainingLoader';
import './styles/style.css';

function App() {
  const [predictionData, setPredictionData] = useState(null);
  const [multiYearData, setMultiYearData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/predict_combined', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch combined prediction');
      }
  
      const data = await response.json();

      setPredictionData({
        labels: ['Predicted Price'],
        values: [data.single_year_prediction],
      });

      setMultiYearData({
        years: data.multi_year_predictions.years,
        predicted_prices: data.multi_year_predictions.prices,
      });

      setStudentData(data.student_predictions);

      setError(null);
      setSubmittedData(formData); // Store submitted data to display to the user
    } catch (error) {
      console.error('Error fetching prediction:', error);
      setError('Failed to fetch prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionData(null);
    setMultiYearData(null);
    setStudentData(null);
    setSubmittedData(null); // Reset submitted data
    setError(null);
  };

  return (
    <div className="app-container">
      <h1>{submittedData ? "Predicted Results" : "Victoria Housing Market Prediction App"}</h1>

      {!submittedData && (
        <div className="intro-text">
          <p>
            Welcome to the Victoria Housing Market Prediction App. Enter the details below to get a price prediction along with a forecast for the next 5 years and the number of predicted students that affected the housing price.
          </p>
        </div>
      )}

      <div className="main-content">
        {submittedData ? (
          <aside className="sidebar">
            <h2>Search Summary</h2>
            <ul>
              <li><strong>Rooms:</strong> {submittedData.Rooms}</li>
              <li><strong>Postcode:</strong> {submittedData.Postcode}</li>
              <li><strong>House Type:</strong> {submittedData.Type}</li>
              <li><strong>Bathrooms:</strong> {submittedData.Bathroom}</li>
              <li><strong>Car Spaces:</strong> {submittedData.Car}</li>
              <li><strong>Landsize (sq m):</strong> {submittedData.Landsize}</li>
              <li><strong>Year:</strong> {submittedData.Year}</li>
            </ul>
            <button className="reset-button" onClick={handleReset}>New Search</button>
          </aside>
        ) : (
          // Show the form if no data has been submitted
          <div className="form-section">
            <UserInputForm onSubmit={handleFormSubmit} />
          </div>
        )}

        <div className="result-section">
          {loading ? (<MLTrainingLoader />
          ) : (
            <>
              {predictionData && (
                <div className="chart-container show">
                  <h2>Predicted Price Results for {submittedData.Year}</h2>
                  <PredictionChart data={predictionData} />
                </div>
              )}
              {multiYearData && (
                <div className="chart-container show">
                  <h2>5-Year Prediction Forecast</h2>
                  <MultiYearPredictionChart data={multiYearData} />
                </div>
              )}
              {studentData && (
                <div className="chart-container show">
                  <h2>Predicted Number of International Students Over the Years</h2>
                  <StudentPredictionChart data={studentData} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>&copy; 2024 Victoria Housing Market Prediction App. All rights reserved.</p>
      </footer>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default App;

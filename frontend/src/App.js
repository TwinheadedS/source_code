import React, { useState } from 'react';
import UserInputForm from './components/UserInputForm';
import PredictionChart from './components/PredictionChart';
import MultiYearPredictionChart from './components/MultiYearPredictionChart';
import StudentPredictionChart from './components/StudentPredictionChart'; // Import the new chart component
import './styles/style.css';

function App() {
  const [predictionData, setPredictionData] = useState(null);
  const [multiYearData, setMultiYearData] = useState(null);
  const [studentData, setStudentData] = useState(null); // Add state for student predictions
  // const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state

  const handleFormSubmit = async (formData) => {
    setLoading(true); // Set loading to true when form submission starts
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

      // Set the single-year prediction data
      setPredictionData({
        labels: ['Predicted Price'],
        values: [data.single_year_prediction],
      });

      // Set the multi-year prediction data
      setMultiYearData({
        years: data.multi_year_predictions.years,
        predicted_prices: data.multi_year_predictions.prices,
      });

      // Set the student prediction data
      setStudentData(data.student_predictions); // Capture the student data

      // // Set the metrics
      // setMetrics(data.metrics);

      setError(null);
    } catch (error) {
      console.error('Error fetching prediction:', error);
      setError('Failed to fetch prediction. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after processing completes
    }
  };

  return (
    <div className="app-container">
      <h1>Housing Market Prediction App</h1>
      <div className="intro-text">
        <p>Welcome to the Housing Market Prediction App. Enter the details below to get a price prediction along with key metrics and a forecast for the next 5 years.</p>
      </div>
      <div className="content-wrapper">
        <div className="form-section">
          <UserInputForm onSubmit={handleFormSubmit} />
          {loading && <div className="loading-spinner"></div>}
        </div>
        <div className="result-section">
          {loading ? (
            <div className="loading-spinner"></div> // Loading spinner shown during loading
          ) : (
            <>
              {predictionData ? (
                <div className="chart-container show">
                  <h2>Prediction Results for {predictionData.labels[0]}</h2>
                  <PredictionChart data={predictionData} />
                </div>
              ) : (
                <div className="placeholder">
                  <p className="placeholder-text">Prediction results will appear here after you submit the form.</p>
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
                  <StudentPredictionChart data={studentData} /> {/* Render the student chart */}
                </div>
              )}
              {/* {metrics && (
                <div className="metrics-container show">
                  <h2>Metrics</h2>
                  <div className="metric-item">
                    <span className="metric-label">MSE:</span>
                    <span className="metric-value">{metrics.mse.toFixed(2)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">RMSE:</span>
                    <span className="metric-value">{metrics.rmse.toFixed(2)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">MAE:</span>
                    <span className="metric-value">{metrics.mae.toFixed(2)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-label">R²:</span>
                    <span className="metric-value">{metrics.r2.toFixed(2)}</span>
                  </div>
                </div>
              )} */}
            </>
          )}
        </div>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;

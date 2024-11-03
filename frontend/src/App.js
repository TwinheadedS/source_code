import React, { useState } from 'react';
import UserInputForm from './components/UserInputForm';
import PredictionChart from './components/PredictionChart';
import './styles/style.css';

function App() {
  const [predictionData, setPredictionData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state

  const handleFormSubmit = async (formData) => {
    setLoading(true); // Set loading to true when form submission starts
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction');
      }

      const data = await response.json();
      setPredictionData({
        labels: ['Predicted Price'],
        values: [data.predicted_price],
      });
      setMetrics({
        mse: data.mse,
        rmse: data.rmse,
        mae: data.mae,
        r2: data.r2,
      });
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
        <p>Welcome to the Housing Market Prediction App. Enter the details below to get a price prediction along with key metrics. This tool is designed to assist you in understanding potential market prices based on various parameters.</p>
      </div>
      <div className="content-wrapper">
        <div className="form-section">
          <UserInputForm onSubmit={handleFormSubmit} />
        </div>
        <div className="result-section">
          {loading ? (
            <div className="loading-spinner"></div> // Loading spinner shown during loading
          ) : (
            <>
              {predictionData ? (
                <div className="chart-container show">
                  <h2>Prediction Results</h2>
                  <PredictionChart data={predictionData} />
                </div>
              ) : (
                <div className="placeholder">
                  <p className="placeholder-text">Prediction results will appear here after you submit the form.</p>
                </div>
              )}
              {metrics && (
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
              )}
            </>
          )}
        </div>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;

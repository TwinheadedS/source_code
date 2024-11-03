import React, { useState } from 'react';
import UserInputForm from './components/UserInputForm';
import PredictionChart from './components/PredictionChart';

function App() {
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text(); // Fetch detailed error text
        console.error('Server response error:', errorText);
        throw new Error(`Failed to fetch prediction: ${errorText}`);
      }

      const data = await response.json();
      setPredictionData({
        labels: ['Predicted Price'],
        values: [data.predicted_price],
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching prediction:', error);
      setError(`Failed to fetch prediction. ${error.message}`); // Show detailed error message
    }
  };

  return (
    <div>
      <h1>Housing Market Prediction App</h1>
      <UserInputForm onSubmit={handleFormSubmit} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {predictionData && (
        <div>
          <h2>Prediction Results</h2>
          <PredictionChart data={predictionData} />
        </div>
      )}
    </div>
  );
}

export default App;

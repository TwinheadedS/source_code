import React, { useState } from 'react';
import UserInputForm from './components/UserInputForm';
import PredictionChart from './components/PredictionChart';

function App() {
  const [predictionData, setPredictionData] = useState(null);

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      // Transform data to fit chart structure (adjust as needed)
      setPredictionData({
        labels: ['Feature 1', 'Feature 2'], // Replace with dynamic labels if needed
        values: data.predictions, // Ensure your API returns predictions in a usable format
      });
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  return (
    <div>
      <h1>Housing Market Prediction App</h1>
      <UserInputForm onSubmit={handleFormSubmit} />
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

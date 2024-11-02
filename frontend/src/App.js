import React, { useState } from 'react';
import UserInputForm from './components/UserInputForm';
import PredictionChart from './components/PredictionChart';

function App() {
  const [predictionData, setPredictionData] = useState(null);
  const [error, setError] = useState(null);

  // Handle form submission and process form data for API call
  const handleFormSubmit = async (formData) => {
    try {
      console.log('Submitting form data:', formData); // Debug: Log the data being submitted

      // Make a POST request to the backend API
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Rooms: parseInt(formData.rooms),
          Postcode: formData.location,
          Bathroom: parseInt(formData.bathroom),
          Car: parseInt(formData.car),
          Landsize: parseFloat(formData.landsize),
          Year: parseInt(formData.year),
          Type: formData.houseType,
        }),
      });

      // Check for response errors
      if (!response.ok) {
        const errorText = await response.text(); // Get detailed error from response
        throw new Error(`Failed to fetch prediction: ${errorText}`);
      }

      // Parse the response JSON
      const data = await response.json();
      setPredictionData({
        labels: ['Prediction'],
        values: [data.predicted_price],
      });
      setError(null); // Clear any existing errors

    } catch (error) {
      console.error('Error fetching prediction:', error);
      setError('Failed to fetch prediction. Please check your input and try again.');
    }
  };

  return (
    <div>
      <h1>Housing Market Prediction App</h1>
      {/* Pass the handleFormSubmit function as the onSubmit prop */}
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

import React, { useState } from 'react';
import axios from 'axios';
import InputForm from './components/InputForm';
import Charts from './components/Charts';

function App() {
    const [priceData, setPriceData] = useState(null);

    const handlePrediction = async (data) => {
        console.log("Data received for prediction:", data); // Debugging line
        try {
            const response = await axios.post('http://127.0.0.1:8000/predict', data);
            console.log("Prediction response:", response.data); // Debugging line
            setPriceData(response.data.prediction); // Assuming the response has a 'prediction' field
        } catch (error) {
            console.error("Error predicting price:", error);
        }
    };

    return (
        <div className="App">
            <h1>Housing Price Prediction</h1>
            <InputForm onPrediction={handlePrediction} />
            {priceData && <div>Predicted Price: ${priceData}</div>}
            {priceData && <Charts priceData={[priceData]} />}
        </div>
    );
}

export default App;

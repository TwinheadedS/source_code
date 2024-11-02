import React from 'react';
import { Bar, Line } from 'react-chartjs-2';

const Charts = ({ priceData }) => {
    const data = {
        labels: priceData.map((_, index) => `Prediction ${index + 1}`),
        datasets: [
            {
                label: 'Predicted Price',
                data: priceData,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }
        ]
    };

    return (
        <div>
            <Bar data={data} />
            <Line data={data} />
        </div>
    );
};

export default Charts;

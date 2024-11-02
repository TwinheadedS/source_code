import React from 'react';
import { Bar } from 'react-chartjs-2';

function PredictionChart({ data }) {
  // Sample data format: { labels: ['Label1', 'Label2'], values: [100, 200] }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Predicted Prices',
        data: data.values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default PredictionChart;

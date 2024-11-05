import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function PredictionChart({ data }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Predicted Prices',
        data: data.values,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)', // Slightly darker on hover
        hoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Predicted Housing Price',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            return `Price: $${tooltipItem.raw.toLocaleString()}`; // Format tooltip values with commas
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `$${value.toLocaleString()}`; // Adds dollar sign and comma formatting to Y-axis
          },
        },
      },
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default PredictionChart;

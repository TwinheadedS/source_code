import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function MultiYearPredictionChart({ data }) {
  const chartData = {
    labels: data.years,
    datasets: [
      {
        label: 'Predicted Prices Over 5 Years',
        data: data.predicted_prices,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.1,
        pointHoverRadius: 8, // Enlarges points on hover
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
        text: '5-Year Housing Price Prediction',
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (tooltipItem) {
            return `Price: $${tooltipItem.formattedValue.toLocaleString()}`; // Format tooltip values with commas
          },
        },
      },
    },
    hover: {
      mode: 'nearest', // Activates nearest point hover
      intersect: true,
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value) {
            return `$${value.toLocaleString()}`; // Adds dollar sign and comma formatting to Y-axis
          },
        },
      },
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 5, // Limit x-axis labels to improve readability
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default MultiYearPredictionChart;

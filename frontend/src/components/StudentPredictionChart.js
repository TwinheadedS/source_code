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
  Filler, // Import Filler to support area charts
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Register Filler for area chart functionality
);

function StudentPredictionChart({ data }) {
  // Prepare the data for the Area Chart
  const chartData = {
    labels: Object.keys(data), // Years from the student prediction data
    datasets: [
      {
        label: 'Predicted Number of International Students',
        data: Object.values(data), // Corresponding student counts
        backgroundColor: 'rgba(153, 102, 255, 0.3)', // Fill color for the area
        borderColor: 'rgba(153, 102, 255, 1)', // Line color
        borderWidth: 2,
        fill: true, // This makes it an area chart
        tension: 0.4, // Curve of the line
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
        text: 'Predicted Number of International Students Over the Years',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Number of Students',
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
}

export default StudentPredictionChart;

import React, { useRef } from 'react';
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
  Filler,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

// Register Chart.js components and the Zoom plugin
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  zoomPlugin
);

function StudentPredictionChart({ data }) {
  const chartRef = useRef(null); // Create a ref to hold the chart instance

  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: 'Predicted Number of International Students',
        data: Object.values(data),
        backgroundColor: 'rgba(153, 102, 255, 0.3)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
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
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
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
        ticks: {
          callback: function (value) {
            return value.toLocaleString();
          },
        },
      },
    },
  };

  // Function to reset zoom
  const resetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  return (
    <div>
      <Line ref={chartRef} data={chartData} options={options} />
      <button onClick={resetZoom} style={{ marginTop: '10px' }}>Reset Zoom</button>
    </div>
  );
}

export default StudentPredictionChart;

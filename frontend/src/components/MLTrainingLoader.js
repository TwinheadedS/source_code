import React, { useEffect, useState } from 'react';
import '../styles/MLTrainingLoader.css';

const messages = [
  "Initializing model training...",
  "Fetching data...",
  "Training machine learning model...",
  "Optimizing predictions...",
  "Finalizing results...",
];

function MLTrainingLoader() {
  const [message, setMessage] = useState("Initializing model training...");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setMessage(messages[index]);
      index += 1;

      // Stop the interval when reaching the final message
      if (index === messages.length) {
        clearInterval(interval);
      }
    }, 3000); // change every 3 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="ml-training-loader">
      <div className="loader-animation"></div>
      <p>{message}</p>
    </div>
  );
}

export default MLTrainingLoader;

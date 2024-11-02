import React, { useState } from 'react';

const InputForm = ({ onPrediction }) => {
    const [rooms, setRooms] = useState('');
    const [postcode, setPostcode] = useState('');
    const [bathrooms, setBathrooms] = useState('');
    const [car, setCar] = useState('');
    const [landsize, setLandsize] = useState('');
    const [year, setYear] = useState('');
    const [propertyType, setPropertyType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents page refresh
        const data = { rooms, postcode, bathrooms, car, landsize, year, propertyType };
        console.log("Form Data:", data); // Debugging line
        onPrediction(data); // Calls the prediction function in App.js
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} placeholder="Rooms" required />
            <input type="number" value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="Postcode" required />
            <input type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} placeholder="Bathrooms" required />
            <input type="number" value={car} onChange={(e) => setCar(e.target.value)} placeholder="Car" required />
            <input type="number" value={landsize} onChange={(e) => setLandsize(e.target.value)} placeholder="Landsize" required />
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" required />
            <input type="text" value={propertyType} onChange={(e) => setPropertyType(e.target.value)} placeholder="Property Type" required />
            <button type="submit">Predict</button>
        </form>
    );
};

export default InputForm;

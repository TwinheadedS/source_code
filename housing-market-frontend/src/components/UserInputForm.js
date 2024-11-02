import React, { useState } from 'react';
import '../styles/FormStyles.css';

function UserInputForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    rooms: '',
    location: '',
    houseType: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Inline validation logic
    if (name === 'rooms' && value <= 0) {
      setErrors({ ...errors, [name]: 'Number of rooms must be greater than 0.' });
    } else if (name === 'location' && value.trim() === '') {
      setErrors({ ...errors, [name]: 'Location is required.' });
    } else if (name === 'houseType' && value === '') {
      setErrors({ ...errors, [name]: 'House type is required.' });
    } else {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Final validation before submitting
    if (!formData.rooms) newErrors.rooms = 'Number of rooms is required.';
    if (!formData.location) newErrors.location = 'Location is required.';
    if (!formData.houseType) newErrors.houseType = 'House type is required.';
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div>
        <label>Number of Rooms:</label>
        <input
          type="number"
          name="rooms"
          value={formData.rooms}
          onChange={handleChange}
          required
          className={errors.rooms ? 'input-error' : ''}
        />
        {errors.rooms && <span className="error-text">{errors.rooms}</span>}
      </div>
      <div>
        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className={errors.location ? 'input-error' : ''}
        />
        {errors.location && <span className="error-text">{errors.location}</span>}
      </div>
      <div>
        <label>House Type:</label>
        <select
          name="houseType"
          value={formData.houseType}
          onChange={handleChange}
          required
          className={errors.houseType ? 'input-error' : ''}
        >
          <option value="">Select Type</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="villa">Villa</option>
        </select>
        {errors.houseType && <span className="error-text">{errors.houseType}</span>}
      </div>
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
}

export default UserInputForm;

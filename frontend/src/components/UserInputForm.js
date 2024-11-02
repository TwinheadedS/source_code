import React, { useState } from 'react';

function UserInputForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    rooms: '',
    location: '',
    houseType: '',
    bathroom: '',
    car: '',
    landsize: '',
    year: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.rooms || parseInt(formData.rooms) <= 0) {
      setError('Please enter a valid number of rooms.');
      return;
    }
    if (!formData.bathroom || parseInt(formData.bathroom) <= 0) {
      setError('Please enter a valid number of bathrooms.');
      return;
    }
    if (!formData.car || parseInt(formData.car) < 0) {
      setError('Please enter a valid number of car spaces.');
      return;
    }
    if (!formData.landsize || parseFloat(formData.landsize) <= 0) {
      setError('Please enter a valid landsize.');
      return;
    }
    if (!formData.year || parseInt(formData.year) < 1900) {
      setError('Please enter a valid year.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      // Pass the data up to the parent component
      if (typeof onSubmit === 'function') {
        onSubmit({
          rooms: parseInt(formData.rooms),
          location: formData.location,
          bathroom: parseInt(formData.bathroom),
          car: parseInt(formData.car),
          landsize: parseFloat(formData.landsize),
          year: parseInt(formData.year),
          houseType: formData.houseType,
        });
      } else {
        console.error('onSubmit prop is not a function');
        setError('Internal error: Form submission handler is not properly configured.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit the form. Please check your input and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div>
        <label>Number of Rooms:</label>
        <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} required />
      </div>
      <div>
        <label>Location:</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} required />
      </div>
      <div>
        <label>House Type:</label>
        <select name="houseType" value={formData.houseType} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="h">House</option>
          <option value="u">Unit</option>
          <option value="t">Townhouse</option>
        </select>
      </div>
      <div>
        <label>Number of Bathrooms:</label>
        <input type="number" name="bathroom" value={formData.bathroom} onChange={handleChange} required />
      </div>
      <div>
        <label>Number of Car Spaces:</label>
        <input type="number" name="car" value={formData.car} onChange={handleChange} required />
      </div>
      <div>
        <label>Landsize (sq m):</label>
        <input type="number" name="landsize" value={formData.landsize} onChange={handleChange} required />
      </div>
      <div>
        <label>Year:</label>
        <input type="number" name="year" value={formData.year} onChange={handleChange} required />
      </div>
      <button type="submit" className="submit-button" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
      {error && <p className="error-text" style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default UserInputForm;

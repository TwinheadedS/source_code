import React, { useState } from 'react';

function UserInputForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    rooms: '',
    postcode: '',
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
    setFormData({ ...formData, [name]: value.trim() }); // Trimmed input values
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enhanced client-side validation
    if (!formData.rooms || parseInt(formData.rooms) <= 0) {
      setError('Please enter a valid number of rooms.');
      return;
    }
    if (!formData.bathroom || parseInt(formData.bathroom) < 0) {
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
    if (!formData.year || parseInt(formData.year) < new Date().getFullYear() || parseInt(formData.year) > new Date().getFullYear() + 100) {
      setError('Please enter a valid year (up to 100 years from now and not less than the current date).');
      return;
    }
    if (!/^[0-9]{4}$/.test(formData.postcode)) {
      setError('Please enter a valid 4-digit postcode.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const formattedData = {
        Rooms: parseInt(formData.rooms),
        Postcode: formData.postcode.trim(),
        Bathroom: parseInt(formData.bathroom),
        Car: parseInt(formData.car),
        Landsize: parseFloat(formData.landsize),
        Year: parseInt(formData.year),
        Type: formData.houseType,
      };
  
      console.log('Payload being sent:', formattedData);
      onSubmit(formattedData);

      // Clear form on success
      setFormData({
        rooms: '',
        postcode: '',
        houseType: '',
        bathroom: '',
        car: '',
        landsize: '',
        year: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Failed to submit the form. Please check your input and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container" aria-live="polite">
      <div>
        <label htmlFor="rooms">Number of Rooms:</label>
        <input
          type="number"
          id="rooms"
          name="rooms"
          value={formData.rooms}
          onChange={handleChange}
          required
          placeholder="e.g., 3"
        />
      </div>
      <div>
        <label htmlFor="postcode">Postcode:</label>
        <input
          type="text"
          id="postcode"
          name="postcode"
          value={formData.postcode}
          onChange={handleChange}
          required
          placeholder="e.g., 3000"
        />
      </div>
      <div>
        <label htmlFor="houseType">House Type:</label>
        <select id="houseType" name="houseType" value={formData.houseType} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option value="h">House</option>
          <option value="u">Unit</option>
          <option value="t">Townhouse</option>
        </select>
      </div>
      <div>
        <label htmlFor="bathroom">Number of Bathrooms:</label>
        <input
          type="number"
          id="bathroom"
          name="bathroom"
          value={formData.bathroom}
          onChange={handleChange}
          required
          placeholder="e.g., 2"
        />
      </div>
      <div>
        <label htmlFor="car">Number of Car Spaces:</label>
        <input
          type="number"
          id="car"
          name="car"
          value={formData.car}
          onChange={handleChange}
          required
          placeholder="e.g., 1"
        />
      </div>
      <div>
        <label htmlFor="landsize">Landsize (sq m):</label>
        <input
          type="number"
          id="landsize"
          name="landsize"
          value={formData.landsize}
          onChange={handleChange}
          required
          placeholder="e.g., 500"
        />
      </div>
      <div>
        <label htmlFor="year">Year:</label>
        <input
          type="number"
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          required
          placeholder="e.g., 2025"
        />
      </div>
      <button type="submit" className="submit-button" disabled={isLoading} aria-busy={isLoading} aria-live="assertive">
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
      {error && (
        <div className="error-text-container">
          <p className="error-text">{error}</p>
        </div>
      )}
    </form>
  );
}

export default UserInputForm;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './RestaurantList.css';

function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState(3000); // Default search radius in meters
  const limit = 10;

  useEffect(() => {
    fetchRestaurants(page);
  }, [page]);

  const fetchRestaurants = (currentPage) => {
    setLoading(true);
    axios
      .get(`https://webapp-sushanth6229-main.onrender.com/api/restaurants?page=${currentPage}&limit=${limit}`)
      .then((response) => {
        setRestaurants(response.data.restaurants);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch restaurant data');
        setLoading(false);
      });
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleLocationSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    const formattedLatitude = parseFloat(latitude).toFixed(6);
    const formattedLongitude = parseFloat(longitude).toFixed(6);

    axios
      .get(`https://webapp-sushanth6229-main.onrender.com/api/restaura/nearby`, {
        params: {
          latitude: formattedLatitude,
          longitude: formattedLongitude,
          maxDistance: radius,
          limit: 10, // Limit to 10 restaurants per page
          page: page, // Include page for pagination
        },
      })
      .then((response) => {
        setRestaurants(response.data.restaurants || []);
        console.log(restaurants);
        setTotalPages(response.data.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch restaurants by location');
        setLoading(false);
      });
  };

  if (loading) return <div className="loading">Loading restaurants...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="restaurant-list-container">
      <h1 className="title">Restaurant List</h1>

      {/* Location Search Form */}
      <form onSubmit={handleLocationSearch} className="search-form">
        <div className="input-group">
          <label>Latitude:</label>
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label>Longitude:</label>
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="input-group">
          <label>Radius (meters):</label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <button type="submit" className="search-button">Search by Location</button>
      </form>

      <ul className="restaurant-list">
  {restaurants.length > 0 ? (
    restaurants.map((restaurant) => (
      <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id} className="restaurant-link">
        <li className="restaurant-item">
          <img 
            src={restaurant.featured_image} 
            alt={restaurant.name} 
            className="restaurant-image" 
          />
          <span className="restaurant-name">{restaurant.name}</span>
        </li>
      </Link>
    ))
  ) : (
    <li className="no-results">No restaurants found</li>
  )}
</ul>
 

      {/* Pagination Buttons */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1} className="pagination-button">
          Previous
        </button>
        <span className="pagination-info">Page {page} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page >= totalPages} className="pagination-button">
          Next
        </button>
      </div>
    </div>
  );
}

export default RestaurantList;

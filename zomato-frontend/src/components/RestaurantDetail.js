import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './RestaurantDetail.css';

function RestaurantDetail() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/restaurants/${id}`)
      .then(response => {
        if (response.data) {
          setRestaurant(response.data);
        } else {
          console.error('Restaurant data not found.');
        }
      })
      .catch(error => console.error('Error fetching restaurant:', error));
  }, [id]);

  if (!restaurant) return <div className="loading">Loading...</div>;

  return (
    <div className="restaurant-detail-container">
      <h1 className="restaurant-title">{restaurant.name}</h1>
      {restaurant.featured_image && <img src={restaurant.featured_image} alt={restaurant.name} className="restaurant-image" />}
      <p className="restaurant-info"><strong>Cuisines:</strong> {restaurant.cuisines}</p>
      <p className="restaurant-info"><strong>Address:</strong> {restaurant.location?.address}, {restaurant.location?.city}</p>
      <p className="restaurant-info"><strong>Average Cost for Two:</strong> {restaurant.average_cost_for_two}</p>
      <p className="restaurant-info"><strong>Price Range:</strong> {restaurant.price_range}</p>
      <p className="restaurant-info"><strong>Rating:</strong> {restaurant.user_rating?.aggregate_rating} ({restaurant.user_rating?.rating_text})</p>
    </div>
  );
}

export default RestaurantDetail;

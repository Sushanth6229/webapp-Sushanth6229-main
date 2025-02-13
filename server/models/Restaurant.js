import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
  id: String,
  name: String,
  cuisines: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere' // Ensure the index for GeoJSON queries
    },
    address: String,
    city: String
  },
  average_cost_for_two: Number,
  price_range: Number,
  user_rating: {
    aggregate_rating: String,
    rating_text: String,
    votes: String
  },
  featured_image: String,
  menu_url: String
});

export default mongoose.model('Restaurant', RestaurantSchema);

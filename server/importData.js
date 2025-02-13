import mongoose from 'mongoose';
import fs from 'fs';
import Restaurant from './models/Restaurant.js';

const dbURI = 'mongodb+srv://sushanthnandivelugu:Rlhs6229@zomato.h1pah.mongodb.net/?retryWrites=true&w=majority&appName=zomato';

mongoose
  .connect(dbURI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const importData = async () => {
  try {
    const data = JSON.parse(fs.readFileSync('file1.json', 'utf-8'));

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Invalid JSON structure: Expected an array at the root.');
    }

    let restaurants = [];

    // Parse and extract restaurant data
    data.forEach((entry) => {
      if (Array.isArray(entry.restaurants)) {
        const extractedRestaurants = entry.restaurants.map((r) => {
          const rest = r.restaurant;
          return {
            id: rest.id,
            name: rest.name,
            cuisines: rest.cuisines,
            location: {
              type: 'Point',
              coordinates: [
                parseFloat(rest.location.longitude),
                parseFloat(rest.location.latitude),
              ], // GeoJSON format
              address: rest.location.address,
              city: rest.location.city,
            },
            average_cost_for_two: rest.average_cost_for_two,
            price_range: rest.price_range,
            user_rating: {
              aggregate_rating: rest.user_rating.aggregate_rating,
              rating_text: rest.user_rating.rating_text,
              votes: rest.user_rating.votes,
            },
            featured_image: rest.featured_image,
            menu_url: rest.menu_url,
          };
        });

        restaurants = restaurants.concat(extractedRestaurants);
      }
    });

    if (restaurants.length === 0) {
      throw new Error('No valid restaurants found in the JSON file.');
    }

    // Insert data into MongoDB
    await Restaurant.insertMany(restaurants);
    console.log('Data successfully imported into MongoDB!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

importData();

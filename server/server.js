import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Restaurant from './models/Restaurant.js'; // Ensure this model file exists

const app = express();
const PORT = 4000;

mongoose
  .connect('mongodb+srv://sushanthnandivelugu:Rlhs6229@zomato.h1pah.mongodb.net/?retryWrites=true&w=majority&appName=zomato', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Get restaurant by ID
app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ id });
    if (!restaurant) {
      return res.status(404).send('Restaurant not found');
    }
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get list of restaurants with pagination
// app.get('/api/restaurants', async (req, res) => {
//   try {
//     const { page = 1, limit = 10 } = req.query;
//     const skip = (page - 1) * limit;
//     const restaurants = await Restaurant.find()
//       .skip(parseInt(skip))
//       .limit(parseInt(limit));
//     res.json(restaurants);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });
//updated



app.get('/api/restaurants', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const totalCount = await Restaurant.countDocuments();
    const restaurants = await Restaurant.find()
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    res.json({
      restaurants,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.get('/api/restaura/nearby', async (req, res) => {
  const { latitude, longitude, maxDistance = 3000 } = req.query;

  // Convert to float and validate
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const maxDist = parseFloat(maxDistance);

  if (isNaN(lat) || isNaN(lng) || isNaN(maxDist)) {
    return res.status(400).json({ message: "Invalid latitude, longitude, or maxDistance" });
  }

  try {
    const nearbyRestaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)], // Ensure it's a float
          },
          $maxDistance: parseFloat(maxDist), // Ensure it's a float
        },
      },
    }).limit(10); // Limit to 10 results for better performance
    
    if (!nearbyRestaurants.length) {
      return res.status(404).json({ message: 'No restaurants found within the specified range' });
    }

    console.log(`Found ${nearbyRestaurants.length} restaurants nearby`);
    res.json({ restaurants: nearbyRestaurants });
  } catch (error) {
    console.error('Error in Location Search:', error);
    res.status(500).json({ message: 'Failed to fetch nearby restaurants', error: error.message });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


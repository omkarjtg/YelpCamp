const mongoose = require('mongoose');
const axios = require('axios');
const { places, descriptors } = require('./seedhelpers');
const cities = require('./cities');
const Campground = require('../models/campgrounds');
async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
};
mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});
connectToDatabase();

const sample = array => array[Math.floor(Math.random() * array.length)];

async function seedImg() {
    try {
      const resp = await axios.get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'QqF3hsoaI2REOTrrVynT5zSxQWHBCFJKXdjRboFlQ3k',
          collections: 1114848,
        },
      })
      return resp.data.urls.small
    } catch (err) {
      console.error(err)
    }
  }

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        let price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: await seedImg(),
            description: 'Lorem ipsum dolor sit amet consectetur elit. Voluptas beatae illo laborum rerum aliquid unde eius labore quas, a quasi eos maiores alias modi exercitationem placeat dolorum suscipit dignissimos. Iure.',
            price: price,
        });
        await camp.save();
    };
};
seedDB();
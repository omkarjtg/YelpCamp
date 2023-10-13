require('dotenv').config();
const mongoose = require('mongoose');
const { places, descriptors } = require('./seedhelpers');
const cities = require('./cities');
const Campground = require('../models/campgrounds');
const { getCoordinates } = require('../middleware.js');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

async function seedDB() {
  // Delete existing campgrounds
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    let price = Math.floor(Math.random() * 20) + 10;
    const location = `${cities[random1000].city}, ${cities[random1000].state}`;

    const selectedImages = [];
    for (let j = 0; j < 2; j++) {
      const randomImageIndex = Math.floor(Math.random() * images.length);
      selectedImages.push({
        url: images[randomImageIndex].url,
        filename: images[randomImageIndex].filename,
      });
    }
    const coordinates = await getCoordinates(location);
    const camp = new Campground({
      author: '64fb0d35e371aec9413ecfd5',
      location: location,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet consectetur elit. Voluptas beatae illo laborum rerum aliquid unde eius labore quas, a quasi eos maiores alias modi exercitationem placeat dolorum suscipit dignissimos. Iure.',
      price: price,
      image: selectedImages,
      geometry: coordinates
    });
    await camp.save();
  }
}

const images = [
  {
    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697221140/YelpCamp/s1k08myzumuevvtfyxhv.jpg',
    filename: 'YelpCamp/s1k08myzumuevvtfyxhv',
    _id: "65298a15d82c75b3ab5f191c"
  },
  {
    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697221141/YelpCamp/qq6wtmgymtonduts7tw5.jpg',
    filename: 'YelpCamp/qq6wtmgymtonduts7tw5',
    _id: "65298a15d82c75b3ab5f191d"
  },
  {
    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697221167/YelpCamp/vvvlwe7fupykk7rkbql0.jpg',
    filename: 'YelpCamp/vvvlwe7fupykk7rkbql0',
    _id: "65298a30d82c75b3ab5f1933"
  },
  {

    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697226600/YelpCamp/qp3w7ah5mdhg2djia8z4.jpg',
    filename: 'YelpCamp/qp3w7ah5mdhg2djia8z4',
    _id: "65299f688b2e69ed53a14734"

  }, {

    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697218924/YelpCamp/c3ljhiacl84suafkgws1.jpg',
    filename: 'YelpCamp/c3ljhiacl84suafkgws1',
    _id: '6529816df5976b605a95a9fb',
  },
  {

    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697218924/YelpCamp/ohuh6hgna6rufhf1hf3e.jpg',
    filename: 'YelpCamp/ohuh6hgna6rufhf1hf3e',
    _id: '6529816df5976b605a95a9fa',
  },
  {
    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697221469/YelpCamp/hivtlfzy0oyrnlvbotar.jpg',
    filename: 'YelpCamp/hivtlfzy0oyrnlvbotar',
    _id: "65298b5dd82c75b3ab5f1953"
  },
  {
    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697221468/YelpCamp/bhkllqtqmx86oztjc7cc.jpg',
    filename: 'YelpCamp/bhkllqtqmx86oztjc7cc',
    _id: "65298b5dd82c75b3ab5f1954"
  }
  // ... your array of image objects
];

// Seed the database
seedDB();

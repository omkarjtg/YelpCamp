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
  for (let i = 0; i < 300; i++) {
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
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude
        ]
      }
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
    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697382758/YelpCamp/gfv928m4hgqca26pzowo.webp',
    filename: 'YelpCamp/gfv928m4hgqca26pzowo',
    _id: "652c016759b647ca99f07b32"
  },
  {
    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697382298/YelpCamp/urvymlmn4b46k2aya7ly.jpg',
    filename: 'YelpCamp/urvymlmn4b46k2aya7ly',
    _id: "652bff9b3ded5df2a58b7dd6"
  },
  {
    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697382299/YelpCamp/ewafq7huv6s0ig3s0ncj.webp',
    filename: 'YelpCamp/ewafq7huv6s0ig3s0ncj',
    _id: "652bff9b3ded5df2a58b7dd7"
  },
  {
    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697221469/YelpCamp/hivtlfzy0oyrnlvbotar.jpg',
    filename: 'YelpCamp/hivtlfzy0oyrnlvbotar',
    _id: "65298b5dd82c75b3ab5f1953"
  },
  {
    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1699031643/YelpCamp/k2trgfkfgmqky5osupjh.jpg',
    filename: 'YelpCamp/hw6va24msvyh2fcqqyo6',
    _id: "652a4e566ced0da220b3095f"
  },
  {
    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697270948/YelpCamp/w9pdc51g9rqfqeq6amlq.jpg',
    filename: 'YelpCamp/w9pdc51g9rqfqeq6amlq',
    _id: "652a4ca54bf51cab5f8be450"
  },
  {
    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697270948/YelpCamp/r6bbdwpwpalnddt6rjdu.jpg',
    filename: 'YelpCamp/r6bbdwpwpalnddt6rjdu',
    _id: "652a4ca54bf51cab5f8be451"
  },
  {
    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697270967/YelpCamp/jplrom1j09kbuxhkboqt.jpg',
    filename: 'YelpCamp/jplrom1j09kbuxhkboqt',
    _id: "652a4cb84bf51cab5f8be466"
  },
  {
    url: 'https://res.cloudinary.com/dbydljfjx/image/upload/v1697271086/YelpCamp/gvixa0egduvtw8uay8tv.webp',
    filename: 'YelpCamp/gvixa0egduvtw8uay8tv',
    _id: "652a4d2f4bf51cab5f8be480"
  }
  // ... your array of image objects
];

// Seed the database
seedDB();

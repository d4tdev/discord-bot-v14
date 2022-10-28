const mongoose = require('mongoose');
let config = require('../config.json');

const connectDB = async () => {
   try {
      await mongoose.connect(config.MongoURI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      });

      console.log(`Database connected.`);
   } catch (err) {
      console.error(err);
      process.exit(1);
   }
};

module.exports = { connectDB };

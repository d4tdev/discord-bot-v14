const mongoose = require('mongoose');


const connectDB = async (MongoURI) => {
   try {
      await mongoose.connect(MongoURI, {
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

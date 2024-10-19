const mongoose = require('mongoose');

const connectToDatabase = async (database) => {
  try {
    await mongoose.connect(database, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

module.exports = { connectToDatabase };

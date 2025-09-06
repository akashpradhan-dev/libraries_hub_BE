import mongoose from 'mongoose';

const url = process.env.MONGO_URI || '';

// Initial connect
const connectDB = async () => {
  try {
    await mongoose.connect(url);
    console.log('✅ MongoDB connected');
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('❌ MongoDB connection error:', err.message);
    } else {
      console.error('❌ MongoDB connection error:', err);
    }
    setTimeout(connectDB, 5000); // retry after 5s
  }
};

// Events
mongoose.connection.on('connected', () => {
  console.log('🔌 MongoDB connection established');
});

mongoose.connection.on('close', () => {
  console.log('❎ MongoDB connection closed');
});

// Export function to use in server.js
export default connectDB;

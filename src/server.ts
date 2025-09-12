import dotenv from 'dotenv';

dotenv.config();
import connectDB from './config/db';
import app from '@/index';

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

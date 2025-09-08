import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Library' }],
});

export default mongoose.model('User', userSchema);

export interface UserPayload {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

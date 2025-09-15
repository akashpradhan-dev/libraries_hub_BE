import mongoose, { Schema } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // optional for Google users
  role: 'user' | 'admin';
  googleId?: string;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Library' }],

    googleId: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);

export interface UserPayload {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

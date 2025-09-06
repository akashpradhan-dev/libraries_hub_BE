import mongoose from 'mongoose';

const LibrarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    version: { type: String, default: '1.0' },
    repositoryUrl: { type: String, required: true },
    homepageUrl: { type: String },
    tags: [{ type: String }],
    exampleUsage: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Library', LibrarySchema);

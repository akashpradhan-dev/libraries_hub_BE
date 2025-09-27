import mongoose from 'mongoose';

const LibrarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    repositoryUrl: { type: String, required: true },
    homepageUrl: { type: String },
    exampleUsage: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'created'],
      default: 'created',
    },
    category: {
      type: String,
      enum: ['Backend', 'FrontEnd', 'Mobile', 'DevOps'],
    },
    language: {
      type: String,
      enum: ['JavaScript', 'Python', 'Java', 'C#', 'Go', 'Ruby', 'PHP', 'C++', 'Other'],
    },
    framework: {
      type: String,
      enum: [
        'React',
        'Angular',
        'Vue.js',
        'Svelte',
        'Node.js',
        'NestJS',
        'Django',
        'Flask',
        'FastAPI',
        'Spring Boot',
        'Ruby on Rails',
        'Laravel',
        'Other',
      ],
    },
    libraryType: {
      type: String,
      enum: [
        'UI Library',
        'State Management',
        'Form Handling',
        'Styling',
        'Animation',
        'Testing',
        'Database',
        'Auth',
        'Utility',
        'Build Tool',
        'Other',
      ],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

// UNIQUE per user
LibrarySchema.index({ createdBy: 1, name: 1 }, { unique: true });

export default mongoose.model('Library', LibrarySchema);

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
      enum: [
        'JavaScript',
        'TypeScript',
        'Python',
        'Java',
        'C#',
        'Go',
        'Ruby',
        'PHP',
        'C++',
        'Other',
      ],
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
      required: false,
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
  {
    timestamps: true,
  }
);

export default mongoose.model('Library', LibrarySchema);

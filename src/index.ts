import express from 'express';
import routes from '@/routes';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';

const app = express();

app.use(morgan('dev'));

const allowedOrigins = [
  'http://localhost:3000',
  'https://devvolt.vercel.app',
  'https://devvolt-dev.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Passport initialization
app.use(passport.initialize());

app.use('/api', routes);

export default app;

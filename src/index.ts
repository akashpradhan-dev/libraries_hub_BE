import express from 'express';
import routes from '@/routes';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import passport from 'passport';

const app = express();

app.use(morgan('dev'));

app.use(
  cors({
    origin: 'http://localhost:3000', // <-- frontend URL
    credentials: true, // <-- allow cookies
  })
);

app.use(express.json());
app.use(cookieParser());

// Passport initialization
app.use(passport.initialize());

app.use('/api', routes);

export default app;

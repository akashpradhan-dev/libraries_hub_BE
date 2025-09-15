import { getMe, googleAuth, login, logout, register } from '@/controller/auth';
import { authenticate } from '@/middlewares/auth';
import passport from '@/middlewares/passport';
import { validate } from '@/middlewares/validate';
import { loginValidator, registerValidator } from '@/validators/user';
import { Router } from 'express';

const router = Router();

//localhost:5000/api/v1/auth

router.post('/login', loginValidator, validate, login);

router.post('/register', registerValidator, validate, register);

router.post('/logout', logout);

// Google OAuth routes
router.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/login/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  googleAuth
);

router.get('/me', authenticate, getMe);

export default router;

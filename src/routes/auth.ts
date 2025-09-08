import { login, register } from '@/controller/auth';
import passport from '@/middlewares/passport';
import { validate } from '@/middlewares/validate';
import { loginValidator, registerValidator } from '@/validators/user';
import { Request, Response, Router } from 'express';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req: Request, res: Response) => {
    // Cast req.user to our AuthUser type
    const userData = req.user as {
      _id: string;
      email: string;
      role: 'user' | 'admin';
      token: string;
    };

    if (!userData || !userData.token) {
      return res.redirect('/login');
    }

    res.redirect(`http://localhost:3000/oauth-success?token=${userData.token}`);
  }
);

router.post('/login', loginValidator, validate, login);

router.post('/register', registerValidator, validate, register);

export default router;

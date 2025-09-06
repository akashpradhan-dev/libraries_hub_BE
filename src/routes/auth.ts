import { login, register } from '@/controller/Auth';
import { validate } from '@/middlewares/validate';
import { loginValidator, registerValidator } from '@/validators/user';
import { Router } from 'express';

const router = Router();

router.post('/login', loginValidator, validate, login);

router.post('/register', registerValidator, validate, register);

export default router;

import { Router } from 'express';
import authRouter from '@/routes/auth';
import libraryRouter from '@/routes/library';
const router = Router();

router.use('/v1/auth', authRouter);

router.use('/v1/libraries', libraryRouter);

export default router;

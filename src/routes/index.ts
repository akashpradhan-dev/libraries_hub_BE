import { Router } from 'express';
import authRouter from '@/routes/auth';
import libraryRouter from '@/routes/library';
import userLibrary from '@/routes/user';
import adminLibrary from '@/routes/admin';
import AI from '@/routes/AI';
const router = Router();

router.use('/v1/auth', authRouter);

router.use('/v1/libraries', libraryRouter);

router.use('/v1/user', userLibrary);

router.use('/v1/admin', adminLibrary);

router.use('/v1/ai', AI);

export default router;

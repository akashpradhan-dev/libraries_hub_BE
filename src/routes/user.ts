import { likedLibraryList, likeLibrary } from '@/controller/userLibrary';
import { authenticate } from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();

router.put('/like', authenticate, likeLibrary);

router.get('/liked', authenticate, likedLibraryList);

export default router;

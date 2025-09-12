import { createLibrary } from '@/controller/library';
import {
  likedLibraryList,
  likeLibrary,
  myLibraryById,
  myLibraryList,
} from '@/controller/userLibrary';
import { authenticate } from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();

router.put('/like', authenticate, likeLibrary);

router.get('/liked-library', authenticate, likedLibraryList);

router.post('/library/save', authenticate, createLibrary);

router.get('/my-library', authenticate, myLibraryList);

router.get('/my-library/:id', authenticate, myLibraryById);

export default router;

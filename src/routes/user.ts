import {
  createLibrary,
  deleteLibrary,
  likedLibraryList,
  likeLibrary,
  myLibraryById,
  myLibraryList,
  updateLibrary,
} from '@/controller/user';
import { authenticate } from '@/middlewares/auth';
import { validate } from '@/middlewares/validate';
import { createLibraryValidator } from '@/validators/libraryValidator';
import { Router } from 'express';

const router = Router();

// create a library
router.put('/like', authenticate, likeLibrary);

router.get('/liked-library', authenticate, likedLibraryList);

router.post('/library/save', createLibraryValidator, validate, authenticate, createLibrary);

router.get('/my-library', authenticate, myLibraryList);

router.get('/my-library/:id', authenticate, myLibraryById);

router.put('/my-library/:id', authenticate, updateLibrary);

router.delete('/my-library/:id', authenticate, deleteLibrary);

export default router;

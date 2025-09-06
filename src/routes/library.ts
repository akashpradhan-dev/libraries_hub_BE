import {
  approveLibrary,
  createLibrary,
  deleteLibrary,
  getLibraries,
  getLibraryById,
  pendingLibaryList,
  updateLibrary,
} from '@/controller/library';
import { authenticate } from '@/middlewares/auth';
import { isAdmin } from '@/middlewares/roles';
import { validate } from '@/middlewares/validate';
import { createLibraryValidator } from '@/validators/libraryValidator';
import { Router } from 'express';

const router = Router();

// create a library
router.post('/save', createLibraryValidator, validate, createLibrary);
// get all libraries
router.get('/', getLibraries);

// pending library list
router.get('/pending-list', authenticate, isAdmin, pendingLibaryList);

// get a library by id
router.get('/:id', getLibraryById);
// update a library by id
router.put('/:id', updateLibrary);
// delete a library by id
router.delete('/:id', deleteLibrary);

// publish pending lib
router.patch('/:id/approve', authenticate, isAdmin, approveLibrary);

export default router;

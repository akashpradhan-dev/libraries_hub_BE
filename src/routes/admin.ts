import { approveLibrary, pendingLibaryList } from '@/controller/admin';
import { createLibrary } from '@/controller/user';
import { authenticate } from '@/middlewares/auth';
import { isAdmin } from '@/middlewares/roles';
import { validate } from '@/middlewares/validate';
import { createLibraryValidator } from '@/validators/libraryValidator';
import { Router } from 'express';

const router = Router();

// /v1/admin - base url

router.post('/save', createLibraryValidator, validate, authenticate, createLibrary);

// pending library list
router.get('/libraries/pending-list', authenticate, isAdmin, pendingLibaryList);

// publish pending lib
router.patch('/library/:id/approve', authenticate, isAdmin, approveLibrary);

export default router;

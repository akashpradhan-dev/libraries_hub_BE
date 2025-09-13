import { getLibraries, getLibraryById } from '@/controller/library';
import { Router } from 'express';

const router = Router();

// get all libraries
router.get('/', getLibraries);
// get a library by id
router.get('/:id', getLibraryById);
// // update a library by id
// router.put('/:id', updateLibrary);
// // delete a library by id
// router.delete('/:id', deleteLibrary);

export default router;

import { body } from 'express-validator';

export const createLibraryValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('repositoryUrl')
    .notEmpty()
    .withMessage('Repository URL is required')
    .isURL()
    .withMessage('Repository URL must be a valid URL'),
];

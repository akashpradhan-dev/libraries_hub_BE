import Library from '@/model/Library';
import { errorResponse, successResponse } from '@/utils/response';
import { isValidId } from '@/utils/validId';
import { Request, Response } from 'express';

const ALLOWED_CATEGORIES = ['Backend', 'Frontend', 'Mobile', 'DevOps'];

export const getLibraries = async (req: Request, res: Response) => {
  try {
    const category = req.query.category as string | undefined;

    if (category) {
      if (!ALLOWED_CATEGORIES.includes(category)) {
        return errorResponse(res, 'Invalid category', 400);
      }
      const libraries = await Library.find({ category, status: 'approved' });
      return successResponse(res, libraries, 'Libraries retrieved successfully', 200);
    }

    const libraries = await Library.find({
      status: 'approved',
    }).populate('createdBy', 'name email');

    return successResponse(res, libraries, 'Libraries retrieved successfully', 200);
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve libraries', 500, error);
  }
};

export const getLibraryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return errorResponse(res, 'Invalid library ID', 400);
    }
    const library = await Library.findById({ _id: id });
    if (!library) {
      return errorResponse(res, 'Library not found', 404);
    }

    return successResponse(res, library, 'Library retrieved successfully', 200);
  } catch (error) {
    return errorResponse(res, 'Failed to retrieve library', 500, error);
  }
};

import Library from '@/model/Library';
import { errorResponse, successResponse } from '@/utils/response';
import { isValidId } from '@/utils/validId';
import { Request, Response } from 'express';

export const getLibraries = async (req: Request, res: Response) => {
  try {
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

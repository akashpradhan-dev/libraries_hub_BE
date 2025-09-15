import Library from '@/model/Library';
import { AuthRequest } from '@/types/types';
import { errorResponse, successResponse } from '@/utils/response';
import { isValidId } from '@/utils/validId';
import { Request, Response } from 'express';

export const getLibraries = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?._id;

    const libraries = await Library.find({
      status: 'approved',
    }).populate('createdBy', 'name email');

    const librariesWithLiked = libraries.map((lib) => {
      const liked = lib?.likes?.some((id) => id?.toString() === userId?.toString());

      return {
        ...lib.toObject(),
        liked,
      };
    });

    return successResponse(res, librariesWithLiked, 'Libraries retrieved successfully', 200);
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

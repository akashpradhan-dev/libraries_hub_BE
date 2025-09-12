import Library from '@/model/Library';
import User from '@/model/User';
import { errorResponse, successResponse } from '@/utils/response';
import { Request, Response } from 'express';

interface RequestBodyParam {
  userId: string;
  liked: boolean;
  libraryId: string;
}

export const likeLibrary = async (req: Request, res: Response) => {
  try {
    const { libraryId, liked }: RequestBodyParam = req.body;

    // @ts-expect-error - ignor this
    const userId = req?.user?._id;
    const existUser = await User.findById({ _id: userId });
    if (!existUser) {
      return errorResponse(res, 'Failed to find user', 400);
    }

    const existingLibrary = await Library.findById({ _id: libraryId });
    if (!existingLibrary) {
      return errorResponse(res, 'Failed to find library', 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      liked ? { $addToSet: { likes: libraryId } } : { $pull: { likes: libraryId } },
      { new: true }
    )
      .select('id')
      .populate('likes')
      .lean();

    if (!updatedUser) {
      return errorResponse(res, 'Failed to update user likes', 400);
    }
    const response = {
      userId: updatedUser?._id,
      likes: updatedUser?.likes,
    };

    return successResponse(
      res,
      response,
      liked ? 'Library liked successfully' : 'Library unliked successfully',
      200
    );
  } catch (error) {
    console.log(error);

    return errorResponse(res, 'Failed to update library status', 500, error);
  }
};

export const likedLibraryList = async (req: Request, res: Response) => {
  try {
    // @ts-expect-error - ignor this
    const userId = req?.user?._id;
    const libList = await User.findById({ _id: userId }).select('_id').populate('likes').lean();

    if (!libList) {
      return successResponse(res, {}, 'no library liked', 200);
    }

    const response = {
      libraries: libList.likes,
    };

    return successResponse(res, response, 'library list fached succesfully', 200);
  } catch (error) {
    return errorResponse(res, 'Failed to update library status', 500, error);
  }
};

export const myLibraryList = async (req: Request, res: Response) => {
  try {
    // @ts-expect-error - ignor this
    const userId = req?.user?._id;
    const libraries = await Library.find({ createdBy: userId }).sort({ createdAt: -1 });
    return successResponse(res, libraries, 'library list fached succesfully', 200);
  } catch (error) {
    return errorResponse(res, 'Failed to update library status', 500, error);
  }
};

export const myLibraryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // @ts-expect-error - ignor this
    const userId = req?.user?._id;

    const library = await Library.findOne({ _id: id, createdBy: userId });

    if (!library) {
      return successResponse(res, {}, 'no library found', 200);
    }

    return successResponse(res, library, 'library fached succesfully', 200);
  } catch (error) {
    return errorResponse(res, 'Failed to update library status', 500, error);
  }
};

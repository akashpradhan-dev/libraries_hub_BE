import Library from '@/model/Library';
import User from '@/model/User';
import { AuthRequest } from '@/types/types';
import { errorResponse, successResponse } from '@/utils/response';
import { isValidId } from '@/utils/validId';
import { Request, Response } from 'express';

interface RequestBodyParam {
  liked: boolean;
  libraryId: string;
}

export const createLibrary = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;

    const userId = authReq.user?._id;

    if (!userId) {
      return errorResponse(res, 'User not authenticated', 401);
    }

    const {
      name,
      description,
      repositoryUrl,
      homepageUrl,
      exampleUsage,
      category,
      language,
      framework,
      libraryType,
    } = req.body;

    if (!name || !description || !repositoryUrl) {
      return errorResponse(res, 'Missing required fields', 400);
    }

    const existingLibrary = await Library.exists({ createdBy: userId, name });

    console.log(existingLibrary);

    if (existingLibrary) {
      return errorResponse(res, 'Library with this name already exists', 409);
    }

    const newLibrary = new Library({
      name,
      description,
      repositoryUrl,
      homepageUrl,
      exampleUsage,
      createdBy: userId,
      category,
      language,
      framework,
      libraryType,
    });

    const savedLibrary = await newLibrary.save();
    return successResponse(res, savedLibrary, 'Library created successfully', 201);
  } catch (error) {
    console.log(error);

    return errorResponse(res, 'Failed to create library', 500, error);
  }
};

export const likeLibrary = async (req: Request, res: Response) => {
  try {
    const { libraryId, liked }: RequestBodyParam = req.body;

    const authReq = req as AuthRequest;

    const userId = authReq.user?._id;
    const existUser = await User.findById({ _id: userId });
    if (!existUser) {
      return errorResponse(res, 'Failed to find user', 400);
    }

    const existingLibrary = await Library.findById({ _id: libraryId });
    if (!existingLibrary) {
      return errorResponse(res, 'Failed to find library', 400);
    }

    await Library.findByIdAndUpdate(
      libraryId,
      liked ? { $addToSet: { likes: userId } } : { $pull: { likes: userId } },
      { new: true }
    );

    const likedLibrary = await User.findByIdAndUpdate(
      userId,
      liked ? { $addToSet: { likes: libraryId } } : { $pull: { likes: libraryId } },
      { new: true }
    )
      .select('id')
      .populate('likes')
      .lean();

    if (!likedLibrary) {
      return errorResponse(res, 'Failed to update user likes', 400);
    }

    return successResponse(
      res,
      {},
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
    const authReq = req as AuthRequest;

    const userId = authReq.user?._id;

    const libList = await User.findById({ _id: userId }).select('_id').populate('likes').lean();

    if (!libList) {
      return successResponse(res, {}, 'no library liked', 200);
    }

    const likedLibrary = libList.likes?.map((lib) => {
      return {
        ...lib,
        liked: true,
      };
    });

    return successResponse(res, likedLibrary, 'library list fached succesfully', 200);
  } catch (error) {
    return errorResponse(res, 'Failed to update library status', 500, error);
  }
};

export const myLibraryList = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;

    const userId = authReq.user?._id;
    const libraries = await Library.find({ createdBy: userId }).sort({ createdAt: -1 });
    return successResponse(res, libraries, 'library list fached succesfully', 200);
  } catch (error) {
    return errorResponse(res, 'Failed to update library status', 500, error);
  }
};

export const myLibraryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const authReq = req as AuthRequest;

    const userId = authReq.user?._id;

    const library = await Library.findOne({ _id: id, createdBy: userId });

    if (!library) {
      return successResponse(res, {}, 'no library found', 200);
    }

    return successResponse(res, library, 'library fached succesfully', 200);
  } catch (error) {
    return errorResponse(res, 'Failed to update library status', 500, error);
  }
};

export const updateLibrary = async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?._id;

    const { id } = req.params;

    if (!isValidId(id)) {
      return errorResponse(res, 'Invalid library ID', 400);
    }

    const library = await Library.findById(id);
    if (!library) {
      return errorResponse(res, 'Library not found', 404);
    }

    // Ensure only the creator can update their library
    if (library.createdBy.toString() !== userId?.toString()) {
      return errorResponse(res, 'Unauthorized', 403);
    }

    const {
      name,
      description,
      repositoryUrl,
      homepageUrl,
      exampleUsage,
      category,
      language,
      framework,
      libraryType,
    } = req.body;

    // If name is being updated, check for uniqueness per user
    if (name && name !== library.name) {
      const duplicate = await Library.findOne({
        createdBy: userId,
        name,
        _id: { $ne: id },
      });

      if (duplicate) {
        return errorResponse(res, 'Library with this name already exists', 409);
      }

      library.name = name;
    }

    if (description !== undefined) library.description = description;
    if (repositoryUrl !== undefined) library.repositoryUrl = repositoryUrl;
    if (homepageUrl !== undefined) library.homepageUrl = homepageUrl;
    if (exampleUsage !== undefined) library.exampleUsage = exampleUsage;
    if (category !== undefined) library.category = category;
    if (language !== undefined) library.language = language;
    if (framework !== undefined) library.framework = framework;
    if (libraryType !== undefined) library.libraryType = libraryType;

    await library.save();

    return successResponse(res, library, 'Library updated successfully', 200);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Failed to update library', 500, error);
  }
};

export const deleteLibrary = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!isValidId(id)) {
      return errorResponse(res, 'Invalid library ID', 400);
    }
    const library = await Library.findByIdAndDelete(id);

    if (!library) {
      return errorResponse(res, 'Library not found', 404);
    }

    return successResponse(res, {}, 'Library deleted successfully', 200);
  } catch (error) {
    return errorResponse(res, 'Failed to delete library', 500, error);
  }
};

export const publishLibrary = async (req: Request, res: Response) => {
  try {
    const libraryId = req.params.id;

    const { action } = req.body;

    if (action !== 'publish') {
      return errorResponse(res, 'Not a valid status', 400);
    }

    if (!isValidId(libraryId)) {
      return errorResponse(res, 'Not a valid libraryId', 400);
    }

    const isLibraryExist = await Library.findById(libraryId);

    if (!isLibraryExist) {
      return errorResponse(res, 'library not exist in our system', 400);
    }

    await Library.findByIdAndUpdate(libraryId, { status: 'pending' }, { new: true });

    return successResponse(res, {}, 'Library send to approval', 200);
  } catch (error) {
    return errorResponse(res, 'Failed to delete library', 500, error);
  }
};

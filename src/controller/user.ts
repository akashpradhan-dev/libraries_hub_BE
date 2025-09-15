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
      tags,
      exampleUsage,
      category,
      language,
      framework,
      libraryType,
    } = req.body;

    if (!name || !description || !repositoryUrl) {
      return errorResponse(res, 'Missing required fields', 400);
    }

    const existingLibrary = await Library.find({ name });

    if (existingLibrary.length > 0) {
      return errorResponse(res, 'Library with this name already exists', 409);
    }

    const newLibrary = new Library({
      name,
      description,
      repositoryUrl,
      homepageUrl,
      tags,
      exampleUsage,
      createdBy: userId,
      status: 'pending',
      category,
      language,
      framework,
      libraryType,
    });

    const savedLibrary = await newLibrary.save();
    return successResponse(res, savedLibrary, 'Library created successfully', 201);
  } catch (error: unknown) {
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
    const { id } = req.params;
    if (!isValidId(id)) {
      return errorResponse(res, 'Invalid library ID', 400);
    }

    const library = await Library.findById(id);
    if (!library) {
      return errorResponse(res, 'Library not found', 404);
    }

    const { name, description, version, repositoryUrl, homepageUrl, tags, exampleUsage } = req.body;

    if (name !== undefined) library.name = name;
    if (description !== undefined) library.description = description;
    if (version !== undefined) library.version = version;
    if (repositoryUrl !== undefined) library.repositoryUrl = repositoryUrl;
    if (homepageUrl !== undefined) library.homepageUrl = homepageUrl;
    if (tags !== undefined) library.tags = tags;
    if (exampleUsage !== undefined) library.exampleUsage = exampleUsage;

    const updatedLibrary = await library.save();
    return successResponse(res, updatedLibrary, 'Library updated successfully', 200);
  } catch (error) {
    return errorResponse(res, 'Failed to update library', 500, error);
  }
};

export const deleteLibrary = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const library = await Library.findById(id);
    if (!library) {
      return errorResponse(res, 'Library not found', 404);
    }

    await library.deleteOne();
    return successResponse(res, {}, 'Library deleted successfully', 200);
  } catch (error) {
    return errorResponse(res, 'Failed to delete library', 500, error);
  }
};

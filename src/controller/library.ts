import Library from '@/model/Library';
import { errorResponse, successResponse } from '@/utils/response';
import { isValidId } from '@/utils/validId';
import { Request, Response } from 'express';

export const createLibrary = async (req: Request, res: Response) => {
  try {
    const { name, description, repositoryUrl, homepageUrl, tags, exampleUsage, userId } = req.body;

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
    });

    const savedLibrary = await newLibrary.save();
    return successResponse(res, savedLibrary, 'Library created successfully', 201);
  } catch (error: unknown) {
    console.log(error);

    return errorResponse(res, 'Failed to create library', 500, error);
  }
};

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

// pending library list to show the admin\
export const pendingLibaryList = async (req: Request, res: Response) => {
  try {
    const pendingList = await Library.find({ status: 'pending' }).populate(
      'createdBy',
      'name email'
    );

    return successResponse(res, pendingList, 'Library retrieved successfully', 200);
  } catch (error) {
    console.log(error);

    return errorResponse(res, 'Failed to delete library', 500, error);
  }
};

export const approveLibrary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    // validate action
    if (!['approved', 'rejected'].includes(action)) {
      return errorResponse(res, "Invalid action. Must be 'approved' or 'rejected'", 400);
    }

    // check if library exists
    const existingLib = await Library.findById(id);
    if (!existingLib) {
      return errorResponse(res, 'Library not found', 404);
    }

    // update status
    await Library.findByIdAndUpdate(id, { status: action }, { new: true });

    return successResponse(res, {}, 'Library status updated successfully', 200);
  } catch (error) {
    return errorResponse(res, 'Failed to update library status', 500, error);
  }
};

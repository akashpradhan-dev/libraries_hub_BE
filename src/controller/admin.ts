import Library from '@/model/Library';
import { errorResponse, successResponse } from '@/utils/response';
import { Request, Response } from 'express';

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

import { AuthRequest } from '@/types/types';
import { generateDescription } from '@/utils/generateAIResponse';
import { errorResponse, successResponse } from '@/utils/response';
import { Request, Response } from 'express';

export const generateAIDescription = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthRequest;
    if (!user?._id) {
      return errorResponse(res, 'User not authenticated', 401);
    }

    const { name, description } = req.body;

    if (!name?.trim()) {
      return errorResponse(res, 'Package name is required', 400);
    }

    // ✅ Build AI prompt
    const basePrompt = `Generate a clear, engaging description (maximum 100 words) for a software package/library named "${name}".`;
    const prompt = description?.trim()
      ? `${basePrompt} The user describes it as: "${description}". Use this context to refine the description.`
      : `${basePrompt} If the package is well-known, describe its purpose and value concisely.`;

    // ✅ Generate description
    const aiResponse = await generateDescription({ prompt });
    if (!aiResponse) {
      return errorResponse(res, 'Failed to generate description', 500);
    }

    return successResponse(res, { description: aiResponse }, 'Description generated successfully');
  } catch (error) {
    return errorResponse(res, 'Internal server error', 500, error);
  }
};

export const generateAIExample = async (req: Request, res: Response) => {
  try {
    const { user } = req as AuthRequest;
    if (!user?._id) {
      return errorResponse(res, 'User not authenticated', 401);
    }

    const { name, description } = req.body;

    if (!name?.trim()) {
      return errorResponse(res, 'Package title is required', 400);
    }

    // Structured AI prompt (only example)
    const basePrompt = `a short usage example in the most relevant programming language for the software package or library named "${name}". 
                    The example should be concise, realistic, and directly demonstrate how to use the package.`;

    // Add optional user description if provided
    const prompt = description?.trim()
      ? `${basePrompt} The user describes it as: "${description}". Use this context to generate the example.`
      : `${basePrompt} If the package is well-known, provide a realistic usage example.`;

    //  Generate description + example
    const aiResponse = await generateDescription({ prompt });

    if (!aiResponse) {
      return errorResponse(res, 'Failed to generate description and example', 500);
    }

    return successResponse(res, aiResponse, 'Description and example generated successfully', 200);
  } catch (error) {
    return errorResponse(res, 'Internal server error', 500, error);
  }
};

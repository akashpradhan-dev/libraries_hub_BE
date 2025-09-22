import { generateAIDescription, generateAIExample } from '@/controller/AI';
import { authenticate } from '@/middlewares/auth';
import { Router } from 'express';

const router = Router();

// POST /api/v1/ai/get/description
router.post('/get/description', authenticate, generateAIDescription);

router.post('/get/example', authenticate, generateAIExample);

export default router;

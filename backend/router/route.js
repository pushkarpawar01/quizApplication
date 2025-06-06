import { Router } from "express";
const router = Router();
import { storeResult } from '../controllers/controller.js';

import * as controller from '../controllers/controller.js';
import { registerUser, loginUser } from '../controllers/authController.js';
import { generateQuestionsByTopic } from '../controllers/sambanovaController.js';

router.route('/questions')
        .get(controller.getQuestions) 
        
        .post(controller.insertQuestions) 
         .delete(controller.dropQuestions) 

router.route('/result')
        .get(controller.getResult)
        .post(controller.storeResult)
        .delete(controller.dropResult)

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);

router.post('/questions/generate', generateQuestionsByTopic);

export default router;

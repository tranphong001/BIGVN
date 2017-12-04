import { Router } from 'express';
import * as TopicController from '../controllers/topic.controller';
const router = new Router();

router.route('/topics').get(TopicController.getTopics);

export default router;

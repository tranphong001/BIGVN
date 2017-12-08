import { Router } from 'express';
import * as Keyword from '../controllers/keyword.controller';
const router = new Router();

router.route('/keyword/:alias').get(Keyword.getKeyword);

export default router;

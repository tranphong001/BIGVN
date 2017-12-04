import { Router } from 'express';
import * as CategoryController from '../controllers/category.controller';
const router = new Router();

router.route('/categories').get(CategoryController.getCategories);

export default router;

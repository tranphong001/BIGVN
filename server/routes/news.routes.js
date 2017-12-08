import { Router } from 'express';
import * as NewsController from '../controllers/news.controller';
const router = new Router();

router.route('/news').put(NewsController.updateNews);
router.route('/news').post(NewsController.createNews);

router.route('/search/news').get(NewsController.getNews2);
router.route('/searchbycity/:city').get(NewsController.getNewsByCity);

router.route('/news/:id').get(NewsController.getNewsByUserId);
router.route('/news/get/:alias').get(NewsController.getNewsOrBlog);
router.route('/news/type/:type').get(NewsController.getNewsByType);
router.route('/tag/:alias').get(NewsController.getTag);

router.route('/news/vip/category/:alias').get(NewsController.getNewsVipCategory);
router.route('/news/vip/all').get(NewsController.getNewsVipAll);

router.route('/blogs/user/:id').get(NewsController.getBlogByUserId);

router.route('/:id').get(NewsController.getAlias);

export default router;

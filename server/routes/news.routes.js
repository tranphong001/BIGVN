import { Router } from 'express';
import * as NewsController from '../controllers/news.controller';
const router = new Router();

router.route('/news').put(NewsController.updateNews);
router.route('/news').post(NewsController.createNews);

router.route('/search/news').get(NewsController.getNews2);
router.route('/searchbycity/:city').get(NewsController.getNewsByCity);
router.route('/blogs').get(NewsController.getBlogs);
router.route('/news/:id').get(NewsController.getNewsByUserId);
router.route('/blogs/user/:id').get(NewsController.getBlogByUserId);

router.route('/news/alias/:alias').get(NewsController.getNewsByAlias);
router.route('/news/category/:category').get(NewsController.getNewsByCategory);

router.route('/blog/alias/:alias').get(NewsController.getBlogByAlias);
router.route('/blogs/topic/:topic').get(NewsController.getBlogByTopic);

router.route('/news/related/:alias').get(NewsController.getRelated);

router.route('/news/vip/category/:alias').get(NewsController.getNewsVipCategory);
router.route('/news/vip/all').get(NewsController.getNewsVipAll);

// router.route('/:id').get(NewsController.getAlias);

export default router;

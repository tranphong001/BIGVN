import { Router } from 'express';
import * as BannerController from '../controllers/banner.controller';
const router = new Router();

router.route('/banners').get(BannerController.getBanner);

export default router;

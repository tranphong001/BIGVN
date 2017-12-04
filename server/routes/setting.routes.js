import { Router } from 'express';
import * as SettingController from '../controllers/setting.controller';
const router = new Router();

router.route('/settings').get(SettingController.getSettings);

export default router;

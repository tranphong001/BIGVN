import { Router } from 'express';
import * as WardController from '../controllers/ward.controller';
const router = new Router();

router.route('/ward').post(WardController.createWard);
router.route('/ward/:districtId').get(WardController.getWards);

export default router;

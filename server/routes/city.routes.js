import { Router } from 'express';
import * as CityController from '../controllers/city.controller';
const router = new Router();

router.route('/city').post(CityController.createCity);
router.route('/city').get(CityController.getCities);

export default router;

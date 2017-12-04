import { Router } from 'express';
import * as UserController from '../controllers/user.controller';
const router = new Router();

router.route('/user').post(UserController.createUser);
router.route('/user/social/facebook').post(UserController.facebookSocial);
router.route('/user/social/google').post(UserController.googleSocial);
router.route('/user/login').post(UserController.loginUser);
router.route('/user/relogin').post(UserController.reloginUser);
router.route('/user/getCaptcha').get(UserController.getCaptcha);

export default router;

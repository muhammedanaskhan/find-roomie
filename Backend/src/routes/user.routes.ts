import { Router } from "express";
import {upload} from '../middleware/multer.middleware'
import { registerUser, loginUser, sendAccessToken, authenticateUser } from "../controllers/user.controller";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser)

router.route('/login').post(loginUser)
router.route('/refresh').post(sendAccessToken)

router.route('/authenticate').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),authenticateUser)

export default router
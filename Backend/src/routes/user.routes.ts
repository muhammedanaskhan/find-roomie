import { Router } from "express";
import { upload } from '../middleware/multer.middleware'
import { registerUser, loginUser, sendAccessToken, authenticateUser, getUserData, updateUserData } from "../controllers/user.controller";

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
    ]), authenticateUser)

router.route('/get-user-data').get(getUserData)
router.route('/update-user-data').put(updateUserData)

export default router
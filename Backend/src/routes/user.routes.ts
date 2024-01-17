import { Router } from "express";
import {upload} from '../middleware/multer.middleware'
import { registerUser, loginUser } from "../controllers/user.controller";

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route('/login').post(loginUser)
export default router
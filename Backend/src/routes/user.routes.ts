import { Router } from "express";
import {upload} from '../middleware/multer.middleware'

const router = Router();

router.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    // registerUser controller
)

export default router
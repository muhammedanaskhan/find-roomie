import { Router } from "express";
import { createListing } from "../controllers/listing.controller";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.route('/create').post(
    upload.fields([
        {
            name: "roomImages",
            maxCount: 3
        }
    ])
    ,createListing)

export default router
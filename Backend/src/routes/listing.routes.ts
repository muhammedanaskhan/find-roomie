import { Router } from "express";
import { createListing, getListings } from "../controllers/listing.controller";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.route('/create').post(
    upload.fields([
        {
            name: "roomImages",
            maxCount: 3
        }
    ])
    , createListing)

router.route('/fetch').get(getListings)

export default router
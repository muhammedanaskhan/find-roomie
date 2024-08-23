import { Router } from "express";
import { createListing, getListingDetails, getListings } from "../controllers/listing.controller";
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

router.route('/allListings').get(getListings)
router.route('/listingDetails').get(getListingDetails)


export default router
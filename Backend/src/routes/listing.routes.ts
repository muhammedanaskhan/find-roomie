import { Router } from "express";
import { createListing, getListingDetails, getListings, getUserListings } from "../controllers/listing.controller";
import { upload } from "../middleware/multer.middleware";
import { googleCallback, googleLogin } from "../controllers/user.controller";

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
router.route('/getUserListings').get(getUserListings)

router.route('/google').get(googleLogin);
router.route('/google/callback').get(googleCallback);


export default router
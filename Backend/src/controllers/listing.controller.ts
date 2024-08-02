import { Request, Response } from "express";
import uploadOnCloudinary from "../utils/fileUpload";
import { User } from "../models/user.model";
import { Listing } from "../models/listing.model";
import { stat } from "fs";

const createListing = async (req: Request, res: Response) => {

    const {
        userEmail,
        location,
        lookingFor,
        rent,
        occupancy,
        description,
        amenities,
        isContactNumberPublic
    } = req.body

    console.log(req.body)
    // handle room images
    const roomImagesLocalPaths = (req.files as { roomImages?: Express.Multer.File[] })?.roomImages?.map((file) => file.path)

    if (!roomImagesLocalPaths) {
        return res.status(400).json({
            status: 'failed',
            message: 'roomImages are required'
        })
    }
    const roomImagesUrls = await Promise.all(roomImagesLocalPaths.map(path => uploadOnCloudinary(path).then(res => res?.secure_url)));

    if (!roomImagesUrls) {
        return res.status(400).json({
            status: 'failed',
            message: 'roomImages not uploaded'
        })
    }

    //find user
    const user = await User.findOne({ email: userEmail })

    if (!user) {
        return res.status(404).json({
            status: 'failed',
            message: 'User not found'
        })
    }


    //create listing
    const listing = await Listing.create({
        user: user._id,
        location,
        lookingFor,
        rent,
        occupancy,
        description,
        roomPhotos: roomImagesUrls,
        amenities,
        isContactNumberPublic
    })

    const createdListing = await Listing.findById(listing._id).populate('user', '-password -refreshToken')

    if (!createdListing) {
        return res.status(500).json({
            status: 'failed',
            message: 'something went wrong while creating listing'
        })
    }

    return res.status(201).json({
        status: 'success',
        data: {
            listing: createdListing
        },
    })
}

const getListing = async (req: Request, res: Response) => {

}

export { createListing }
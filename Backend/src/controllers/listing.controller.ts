import { Request, Response } from "express";
import uploadOnCloudinary from "../utils/fileUpload";
import { User } from "../models/user.model";
import { Listing } from "../models/listing.model";
import { stat } from "fs";

const createListing = async (req: Request, res: Response) => {

    const {
        userEmail,
        location,
        geometry,
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

    let parsedGeometry;

    try {
        parsedGeometry = typeof geometry === 'string' ? JSON.parse(geometry) : geometry;
    } catch (error) {
        console.error("Error parsing coordinates:", error);
        return res.status(400).json({ error: "Invalid coordinates format" });
    }

    if (!parsedGeometry || parsedGeometry.type !== 'Point' || !Array.isArray(parsedGeometry.coordinates) || parsedGeometry.coordinates.length !== 2) {
        return res.status(400).json({ error: "Invalid coordinates structure" });
    }

    const [longitude, latitude] = parsedGeometry.coordinates;
    if (typeof longitude !== 'number' || typeof latitude !== 'number') {
        return res.status(400).json({ error: "Coordinates must be numbers" });
    }


    console.log("parsedCoordinates", parsedGeometry)
    //create listing

    try {
        const listing = await Listing.create({
            user: user._id,
            location,
            geometry: parsedGeometry,
            lookingFor,
            rent,
            occupancy,
            description,
            roomPhotos: roomImagesUrls,
            amenities: JSON.parse(amenities),
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

    } catch (error) {
        console.error("Error creating listing:", error);
        return res.status(500).json({ error: "Error creating listing" });
    }



}

const getListing = async (req: Request, res: Response) => {

}

export { createListing }
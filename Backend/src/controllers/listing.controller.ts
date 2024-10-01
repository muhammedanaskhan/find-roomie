import { Express, Request, Response } from "express";
import { Multer } from 'multer';

import uploadOnCloudinary from "../utils/fileUpload";
import { User } from "../models/user.model";
import { Listing } from "../models/listing.model";
import { stat } from "fs";
import jwt, { JwtPayload, verify } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

const createListing = async (req: Request, res: Response) => {

    const {
        userEmail,
        location,
        city,
        geometry,
        lookingFor,
        currencySymbol,
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
            city,
            geometry: parsedGeometry,
            lookingFor,
            currencySymbol,
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

const getListings = async (req: Request, res: Response) => {
    const { searchTerm, maxDistanceInMeters, lat, lng } = req.query;

    console.log("Query", req.query)
    try {
        const listings = await searchListings(searchTerm as string, Number(maxDistanceInMeters), Number(lat), Number(lng));


        console.log("Listings", listings)

        return res.status(201).json({
            status: 'success',
            data: {
                listings: listings
            },
        })

    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ error: 'An error occurred while searching listings' });
    }
}

const searchListings = async (searchTerm: string, maxDistanceInMeters: number, lat?: number, lng?: number) => {
    let query;

    if (lat && lng) {
        try {

            const listings = await Listing.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: "Point",
                            coordinates: [lng, lat]
                        },
                        distanceField: "distance",
                        maxDistance: maxDistanceInMeters,
                        spherical: true
                    }
                },
                {
                    $addFields: {
                        distanceInKm: { $divide: ["$distance", 1000] } // Convert meters to kilometers
                    }
                },
                {
                    $sort: { distance: 1 } // Sort by distance ascending
                }
            ]);

            const populatedListings = await Listing.populate(listings, {
                path: 'user',
                select: 'avatar fullName'
            });

            console.log("Listings", listings)

            return populatedListings;
        } catch (error) {
            console.error("Error parsing coordinates:", error);
        }


    } else {
        const cityQuery = searchTerm ? { city: { $regex: new RegExp(searchTerm, 'i') } } : {};

        query = Listing.find(cityQuery).sort({ createdAt: -1 }).populate('user', 'avatar fullName').select('location lookingFor rent currencySymbol')

        const listings = await query.exec();
        return listings;
    }
}

const getListingDetails = async (req: Request, res: Response) => {
    const { listingId } = req.query;
    console.log("ListingId", listingId)

    try {
        const listing = await Listing.findById(listingId).populate('user', '-password -refreshToken');

        return res.status(200).json({
            status: 'success',
            data: {
                listing: listing
            },
        })
    }
    catch (error) {
        console.error("Error fetching listing details:", error);
        return res.status(400).json({ error: "Error fetching listing details" });
    }
}

const getUserListings = async (req: Request, res: Response) => {
    const authHeader = req.headers['authorization']
    let decoded: JwtPayload | undefined

    if (authHeader) {
        const accessToken = authHeader.split(' ')[1];

        const secret = process.env.ACCESS_TOKEN_SECRET as jwt.Secret;
        decoded = verify(accessToken, secret) as JwtPayload;
    }

    if (!decoded) {
        throw new ApiError(403, "No token provided");
    }

    const user = await User.findById(decoded._id)

    if (!user) throw new ApiError(404, "User not found")

    const listings = await Listing.find({ user: user._id }).populate('user', 'avatar fullName').select('location lookingFor rent currencySymbol')

    return res.status(200).json({
        status: 'success',
        data: {
            listings: listings
        },
    })
}

export { createListing, getListings, getListingDetails, getUserListings }
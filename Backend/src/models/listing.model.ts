import mongoose, { Mongoose, Schema, Types } from "mongoose";

interface IListing {
    user: Types.ObjectId;
    location: string;
    lookingFor: 'Male' | 'Female' | 'Any';
    rent: number;
    occupancy: 'Single' | 'Shared' | 'Any';
    description: string;
    roomPhotos: string[];
    amenities: string[];
    isContactNumberPublic: boolean;
}

const ListingSchema = new mongoose.Schema<IListing>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        location: {
            type: String,
            required: true
        },
        lookingFor: {
            type: String,
            enum: ['Male', 'Female', 'Any'],
            required: true
        },
        rent: {
            type: Number,
            required: true
        },
        occupancy: {
            type: String,
            enum: ['Single', 'Shared', 'Any'],
            required: true
        },
        description: {
            type: String,
            required: true
        },
        roomPhotos: {
            type: [String],
            required: true
        },
        amenities: {
            type: [String],
            required: true
        },
        isContactNumberPublic: {
            type: Boolean,
            required: true
        }
    }
)

export const Listing = mongoose.model<IListing>("Listing", ListingSchema)
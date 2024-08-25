import mongoose, { Mongoose, Schema, Types } from "mongoose";

interface IListing {
    user: Types.ObjectId;
    location: string;
    city: string;
    geometry: {
        type: string;
        coordinates: [number, number];
    };
    lookingFor: 'Male' | 'Female' | 'Any';
    currencySymbol: string;
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
        city: {
            type: String,
            required: true,
            index: true
        },
        geometry: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        lookingFor: {
            type: String,
            enum: ['Male', 'Female', 'Any'],
            required: true
        },
        currencySymbol: {
            type: String,
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

ListingSchema.index({ geometry: '2dsphere' })

export const Listing = mongoose.model<IListing>("Listing", ListingSchema)
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt, { SignOptions } from 'jsonwebtoken'

interface IUser {
    userName: string;
    email: string;
    password: string;
    refreshToken: string;
    fullName: string;
    avatar: string;
    gender: string;
    contactNumber: number;
    isUserAuthenticated: boolean;
    city: string;
    country: string;
    preferences: string[];
    isPasswordCorrect(password: string): Promise<boolean>
    generateAccessToken(): Promise<string>
    generateRefreshToken(): Promise<string>
}
const UserSchema = new mongoose.Schema<IUser>(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Pasword is required']
        },
        refreshToken: {
            type: String
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String,
        },
        gender: {
            type: String,
            enum: ['Male', 'Female']
        },
        contactNumber: {
            type: Number,
        },
        isUserAuthenticated: {
            type: Boolean,
            default: false
        },
        country: {
            type: String,
        },
        city: {
            type: String,
        },
        preferences: {
            type: [
                {
                    type: String,
                    enum: [
                        'Non Smoker',
                        'Non Alcoholic',
                        'Nomad',
                        'Introvert',
                        'Nerd',
                        'Pet Friendly',
                        'Vegetarian',
                        'Gym Fanatic',
                        'Gamer',
                        'Early Bird',
                        'Night Owl',
                        'Fitness Freak',
                        'Partygoer',
                        'Music Lover',
                        'Minimalist',
                        'Foodie',
                        'Remote Worker',
                        'Tech Geek',
                        'Religious',
                        'Clean Freak'
                    ]
                }
            ],

        }
    },
    { timestamps: true }
)

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET as jwt.Secret,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET as jwt.Secret,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model<IUser>("User", UserSchema)
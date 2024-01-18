import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt, {SignOptions} from 'jsonwebtoken'

const UserSchema = new mongoose.Schema(
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
        isUserAuthenticated:{
            type: Boolean,
            default: false
        },
        preferences: {
            type: [
                {
                    type: String,
                    // enum: [
                    //     'Non Smoker',
                    //     'Non Alcoholic',
                    //     'Nomad',
                    //     'Introvert',
                    //     'Nerd',
                    //     'Pet Friendly',
                    //     'Vegetarian',
                    //     'Gym Fanatic',
                    //     'Gamer',
                    //     'Early Bird',
                    //     'Night Owl',
                    //     'Fitness Freak',
                    //     'Partygoer',
                    //     'Music Lover',
                    //     'Minimalist',
                    //     'Foodie',
                    //     'Remote Worker',
                    //     'Tech Geek',
                    //     'Religious',
                    //     'Clean Freak'
                    // ]
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

interface UserDocument extends mongoose.Document {
    isPasswordCorrect(password: string): Promise<boolean>
    generateAccessToken(): Promise<string>
    generateRefreshToken():Promise<string>
}

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

export const User = mongoose.model<UserDocument>("User", UserSchema)
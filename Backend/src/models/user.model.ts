import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        userName:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password:{
            type: String,
            required: [true, 'Pasword is required']
        },
        refreshToken:{
            type: String
        },
        fullName:{
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar:{
            type: String,
            required: true
        },
        gender:{
            type: String,
            required: true,
            enum: ['Male', 'Female']
        },
        contactNumber:{
            type: Number,
            required: true,
            unique: true
        },
        preferences:{
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

export const User = mongoose.model("User", UserSchema)
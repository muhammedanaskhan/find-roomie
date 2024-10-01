import { Express, Request, Response } from "express";
import { Multer } from 'multer';

import { User } from '../models/user.model'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import { AsyncHandler } from '../utils/AyncHandler'
import uploadOnCloudinary from '../utils/fileUpload'
import jwt, { JwtPayload, verify } from 'jsonwebtoken'


import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

export const googleLogin = (req, res) => {
    const redirectUri = `${process.env.BACKEND_URL_PROD}/api/v1/users/google/callback`;
    const authUrl = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['profile', 'email'],
        redirect_uri: redirectUri,
    });
    res.redirect(authUrl);
};


export const googleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        const redirectUri = `${process.env.BACKEND_URL_PROD}/api/v1/users/google/callback`;

        // Get tokens from Google
        const { tokens } = await client.getToken({
            code,
            redirect_uri: redirectUri,
        });

        // Verify the token and get user's Google profile
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token || '',
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload) {
            throw new Error('Failed to get token payload');
        }

        const { name, email, picture } = payload;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                userName: email?.split('@')[0],
                fullName: name,
                email,
                avatar: picture,
                password: '',
            });
        }

        // Generate JWT access and refresh tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id.toString());

        const options = {
            httpOnly: true,
            secure: true,
        };

        // Send tokens and user information in response
        res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({
                accessToken,
                refreshToken,
                user: {
                    userName: user.userName,
                    fullName: user.fullName,
                    email: user.email,
                    avatar: user.avatar,
                },
                message: 'Google login successful',
            })
            .redirect(`${process.env.FRONTEND_URL_PROD}/auth/google-success`);
    } catch (error) {
        return res.status(500).json({ error: "Google Login failed" });
    }
};

const generateAccessAndRefreshToken = async (userId: string) => {
    try {
        const user: any = await User.findById(userId)
        const accessToken = user?.generateAccessToken();
        const refreshToken = user?.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user?.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error: any) {
        throw new ApiError(500, 'error while generating Access And Refresh Token', error)
    }
}

const registerUser = AsyncHandler(async (req, res) => {

    const { userName, fullName, email, password, gender, contactNumber, preferences }: {
        userName: string
        fullName: string,
        email: string,
        password: string,
        gender: string,
        contactNumber: string,
        preferences: string
    } = req.body

    if (
        [fullName, email, password, gender, preferences].some((field) => {
            field?.trim() === ''
        })
    ) {
        return new ApiError(400, 'All fields are required')
    }

    const ifUserExists = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (ifUserExists) {
        throw new ApiError(409, 'This user already exists!')
    }

    const avatarLocalPath = (req.files as { avatar?: Express.Multer.File[] })?.avatar?.[0]?.path;

    // if(!avatarLocalPath) throw new ApiError(409, 'Avatar Required')

    //upload Avatar to cloudinary

    // const avatar = await uploadOnCloudinary(avatarLocalPath)

    // if(!avatar){
    //     throw new ApiError(400, 'Avatar not uploaded')
    // }

    const user = await User.create(
        {
            userName,
            fullName,
            avatar: "",
            email,
            password,
            gender,
            contactNumber,
            preferences
        }
    )

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) throw new ApiError(500, "something went wrong while registering user")

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = AsyncHandler(async (req, res) => {

    console.log("login")
    const { email, userName, password }: {
        email: string,
        userName: string,
        password: string
    } = req.body

    if (!(email || userName)) {
        throw new ApiError(400, "Enter email/username")
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })

    console.log("user", user)


    if (!user) throw new ApiError(400, "User does not exists")

    const foundUserUserName = user.userName
    const foundUserEmail = user.email
    const isUserAuthenticated = user.isUserAuthenticated

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Password Invalid")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id.toString())

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    "accessToken": accessToken,
                    "userName": foundUserUserName,
                    "email": foundUserEmail,
                    "isUserAuthenticated": isUserAuthenticated
                },
                "User Logged In successfully"
            )
        )

})

const sendAccessToken = AsyncHandler(async (req, res) => {

    //verify provided refreshToken
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw new ApiError(403, "No refreshToken found")
    }

    const user = await User.findOne({ refreshToken })

    if (!user) throw new ApiError(403, "No user found")

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as jwt.Secret,
        ) as JwtPayload

        if (decoded._id !== user._id.toString()) throw new ApiError(405, 'Request forbidden')

    } catch (err) {
        return res.status(403).json(err)
    }

    // generate new access token

    const accessToken = user?.generateAccessToken();

    return res.status(201).json(
        new ApiResponse(200, accessToken, "Access Token Generated SuccesFully")
    )

})

const authenticateUser = AsyncHandler(async (req, res) => {
    const authHeader = req.headers['authorization'];

    let decoded: JwtPayload | undefined;

    if (authHeader) {
        const accessToken = authHeader.split(' ')[1];

        // Verify the token
        const secret = process.env.ACCESS_TOKEN_SECRET as jwt.Secret;
        decoded = verify(accessToken, secret) as JwtPayload;
    }

    // Check if no token was provided
    if (!decoded) {
        throw new ApiError(403, "No token provided");
    }

    const avatarLocalPath = (req.files as { avatar?: Express.Multer.File[] })?.avatar?.[0]?.path;

    if (!avatarLocalPath) throw new ApiError(409, 'Avatar Required')

    //upload Avatar to cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath)


    if (!avatar) {
        throw new ApiError(400, 'Avatar not uploaded')
    }

    const gender = req.body.gender;
    const city = req.body.city;
    const country = req.body.country;
    const preferencesArray = JSON.parse(req.body.preferences);

    const user = await User.findById(decoded._id)

    if (!user) throw new ApiError(404, "User not found")

    user.avatar = avatar.secure_url;
    user.gender = gender;
    user.city = city;
    user.country = country;
    user.preferences = preferencesArray;
    user.isUserAuthenticated = true;

    await user.save();

    return res.status(201).json(
        new ApiResponse(200, "User authenticated successfully")
    )



})

const getUserData = AsyncHandler(async (req, res) => {

    const authHeader = req.headers['authorization'];

    let decoded: JwtPayload | undefined;

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

    return res.status(200).json(
        new ApiResponse(200, user, "User data retrieved successfully")
    )

})

const updateUserData = AsyncHandler(async (req, res) => {
    const { fullName, gender, city, preferences } = req.body
    console.log("req.body", req.body)

    const authHeader = req.headers['authorization'];

    let decoded: JwtPayload | undefined;

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

    const initialFullName = user.fullName
    console.log("initialFullName", initialFullName, "fullname", fullName)
    if (initialFullName !== fullName) {
        user.fullName = fullName
    }

    const initialGender = user.gender
    console.log("initialGender", initialGender, "gender", gender)
    if (initialGender !== gender) {
        user.gender = gender
    }

    const initialCity = user.city
    if (initialCity !== city) {
        user.city = city
    }

    const initialPreferences = user.preferences
    if (initialPreferences !== preferences) {
        user.preferences = preferences
    }

    await user.save()

    return res.status(200).json(
        new ApiResponse(200, user, "User data updated successfully")
    )

})

export {
    registerUser,
    loginUser,
    sendAccessToken,
    authenticateUser,
    getUserData,
    updateUserData
}
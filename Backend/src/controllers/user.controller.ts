import { User } from '../models/user.model'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import { AsyncHandler } from '../utils/AyncHandler'
import uploadOnCloudinary from '../utils/fileUpload'
import jwt, { JwtPayload } from 'jsonwebtoken'

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

    console.log(user)

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

        if(decoded._id !== user._id.toString()) throw new ApiError(405, 'Request forbidden')

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

    console.log("req.files", req.files)

    const avatarLocalPath = (req.files as { avatar?: Express.Multer.File[] })?.avatar?.[0]?.path;

    console.log("avatarLocalPath", avatarLocalPath)
    // if(!avatarLocalPath) throw new ApiError(409, 'Avatar Required')

    //upload Avatar to cloudinary

    // const avatar = await uploadOnCloudinary(avatarLocalPath)

    // if(!avatar){
    //     throw new ApiError(400, 'Avatar not uploaded')
    // }
})

export {
    registerUser,
    loginUser,
    sendAccessToken,
    authenticateUser
}
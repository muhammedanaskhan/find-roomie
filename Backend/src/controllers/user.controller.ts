import { User } from '../models/user.model'
import { ApiError } from '../utils/ApiError'
import { ApiResponse } from '../utils/ApiResponse'
import { AsyncHandler } from '../utils/AyncHandler'
import uploadOnCloudinary from '../utils/fileUpload'

const generateAccessAndRefreshToken = async (userId: string) =>{
    try{
        const user:any = await User.findById(userId)
        const accessToken = user?.generateAccessToken();
        const refreshToken = user?.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user?.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    }catch(error: any){
        throw new ApiError(500,'error while generating Access And Refresh Token', error)
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
        $or: [{userName},{email}]
    })

    if(ifUserExists){
        throw new ApiError(409, 'This user already exists!')
    }

    const avatarLocalPath = (req.files as { avatar?: Express.Multer.File[] })?.avatar?.[0]?.path; 

    if(!avatarLocalPath) throw new ApiError(409, 'Avatar Required')

    //upload Avatar to cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar){
        throw new ApiError(400, 'Avatar not uploaded')
    }

    const user = await User.create(
        {
            userName,
            fullName,
            avatar: avatar.url,
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

const loginUser = AsyncHandler( async(req, res) => {
    
    const {email, userName, password} : {
        email: string,
        userName: string,
        password: string
    } = req.body

    console.log(req.body)

    if(!(email || userName)){
        throw new ApiError(400, "Enter email/username")
    }

    const user = await User.findOne({
        $or: [{userName}, {email}]
    })

    if(!user) throw new ApiError(400, "User does not exists")

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
         throw new ApiError(400, "Password Invalid")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

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
            "User Logged In successfully"
        )
    )
    
})

export {
    registerUser,
    loginUser
}
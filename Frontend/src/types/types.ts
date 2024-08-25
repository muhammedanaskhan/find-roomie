type userType = {
    "_id": string,
    "firstName": string,
    "lastName": string,
    "userName": string,
    "email": string,
    "password": string,
    "avatar": string,
    "gender": string,
    "contactNumber": string
}

type listingCardPropsType = {
    userName: string,
    userAvatar: string,
    currencySymbol: string,
    location: string,
    rent: number,
    lookingFor: string,
    distanceInKm?: number
}

export type { userType, listingCardPropsType }
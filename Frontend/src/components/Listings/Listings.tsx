import React, { use } from 'react'

const Listings = ({ address }: any) => {

    const [listings, setListings] = React.useState([])

    React.useEffect(() => {
        // fetchlistings
    }
        , [address])
    return (
        <div>Listings</div>
    )
}

export default Listings
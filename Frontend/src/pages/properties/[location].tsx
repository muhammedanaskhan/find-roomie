import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";

export default function Home() {
    return (
        <div>
            <h1>Home</h1>
        </div>
    )
}
// prompt-

// i am using nextjs pages router, 

// i want to make a dynamic page that will basically show the properties in a particular city or near a particular address, it will be server side rendered, also in that page the header and footer will be static, the <main/> which will show the fetched properties list will change according to the searched query, (basically following the layout pattern)

interface Params extends ParsedUrlQuery {
    location: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { location } = context.params as Params;
}
import { GetServerSidePropsContext } from "next";
import { ParsedUrlQuery } from "querystring";

export default function Home() {
    return (
        <div>
            <h1>Home</h1>
        </div>
    )
}

interface Params extends ParsedUrlQuery {
    location: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { location } = context.params as Params;
}
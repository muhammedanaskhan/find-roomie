import Header from "../Header";

export default function SharedHeaderLayout({ children }: any) {

    
    return (
        <div>
            <Header />
            <main className="">{children}</main>
        </div>
    );
}
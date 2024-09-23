import { useSelector } from "react-redux";
import Header from "../Header";
import { RootState } from "@/Redux/store";

export default function SharedHeaderLayout({ children }: any) {

    const { userName, email, avatar, isUserAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <div>
            <Header
                userName={userName}
                email={email}
                avatar={avatar}
                isUserAuthenticated={isUserAuthenticated}
            />
            <main className="">{children}</main>
        </div>
    );
}
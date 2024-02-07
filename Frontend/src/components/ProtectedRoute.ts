import { useRouter } from "next/router";
import { ReactElement, ReactNode, useEffect } from "react";
import useIsUserAuthentication from "@/utils/Auth";

interface Props {
    children: ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const router = useRouter();
    const ifUserExists = useIsUserAuthentication();

    useEffect(() => {
        if (!ifUserExists) {
            router.push('/login');
        }
    }, [ifUserExists, router]);

    return children as ReactElement;
};

export default ProtectedRoute;

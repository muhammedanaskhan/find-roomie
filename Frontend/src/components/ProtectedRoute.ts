import { useRouter } from "next/router";
import { ReactElement, ReactNode, useEffect } from "react";

interface Props {
    children: ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            router.push('/login');
        }
    }, []);

    return children as ReactElement;
};

export default ProtectedRoute;

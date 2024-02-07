import { useRouter } from "next/router";
import { ReactElement, ReactNode, useEffect } from "react";

interface Props {
    children: ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const isUserAuthenticated = localStorage.getItem('isUserAuthenticated');

        if (!accessToken) {
            router.push('/login');
        }else if (isUserAuthenticated === 'false') {
            router.push('/login/personal-details');
        }
    }, []);

    return children as ReactElement;
};

export default ProtectedRoute;

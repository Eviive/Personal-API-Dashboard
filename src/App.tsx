import { UserService } from "api/services";
import { Loader } from "components/common";
import { useAuthContext } from "contexts/AuthContext";
import { useAxiosInterceptors } from "hooks/useAxiosInterceptors";
import { getTitleAndMessage } from "libs/utils";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

import "./styles/reset.scss";

export const App: FC = () => {

    const [ isLoading, setIsLoading ] = useState(true);

    const { accessToken, setAccessToken } = useAuthContext();

    useAxiosInterceptors(accessToken, setAccessToken);

    useEffect(() => {
        (async () => {
            try {
                const res = await UserService.refresh(false);
                setAccessToken(res.roles.includes("ROLE_ADMIN") ? res.accessToken : "");
            } catch (e) {
                console.error("Persistent login failed", getTitleAndMessage(e));
                setAccessToken("");
            } finally {
                setIsLoading(false);
            }
        })();
    }, [ setAccessToken ]);

    return (
        <>
            { isLoading
                ? <Loader />
                : <Outlet />
            }
            <Toaster
                position="bottom-center"
                reverseOrder={true}
            />
        </>
    );
};

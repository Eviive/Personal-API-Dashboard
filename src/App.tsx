import { UserService } from "api/services";
import { Loader } from "components/common";
import { AuthContextProvider } from "contexts/AuthContext";
import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import "styles/reset.scss";

export const App: FC = () => {

    const [ accessToken, setAccessToken ] = useState("");

    const [ isLoading, setIsLoading ] = useState(true);

    useEffect(() => {
        const persistLogin = async () => {
            try {
                const res = await UserService.refresh();
                setAccessToken(res.roles.includes("ROLE_ADMIN") ? res.accessToken : "");
            } catch (e) {
                console.error("Persistent login failed", e);
                setAccessToken("");
            } finally {
                setIsLoading(false);
            }
        };
        persistLogin();
    }, [ setAccessToken ]);

    return (
        <AuthContextProvider value={{
            accessToken,
            setAccessToken
        }}>
            { isLoading
                ? <Loader />
                : <Outlet />
            }
        </AuthContextProvider>
    );
};

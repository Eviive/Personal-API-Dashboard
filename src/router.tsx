import { queryClient } from "api/query-client";
import { App } from "App";
import { initAuthContext } from "libs/auth";
import { ErrorPage } from "pages/error";
import { createBrowserRouter } from "react-router-dom";

await initAuthContext();

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <App />,
            errorElement: <ErrorPage />,
            children: [
                {
                    path: "/",
                    lazy: async () => ({
                        Component: (await import("layouts/main")).Main
                    }),
                    children: [
                        {
                            index: true,
                            lazy: async () => ({
                                Component: (await import("pages/home/home")).Home,
                                loader: (await import("pages/home/home.loader")).homeLoader(
                                    queryClient
                                )
                            })
                        },
                        {
                            path: "/projects",
                            lazy: async () => ({
                                Component: (await import("pages/projects/projects")).Projects,
                                loader: (
                                    await import("pages/projects/projects.loader")
                                ).projectsLoader(queryClient)
                            })
                        },
                        {
                            path: "/skills",
                            lazy: async () => ({
                                Component: (await import("pages/skills/skills")).Skills,
                                loader: (await import("pages/skills/skills.loader")).skillsLoader(
                                    queryClient
                                )
                            })
                        },
                        {
                            path: "/health",
                            lazy: async () => ({
                                Component: (await import("pages/health/health")).Health,
                                loader: (await import("pages/health/health.loader")).healthLoader(
                                    queryClient
                                )
                            })
                        }
                    ]
                },
                {
                    path: "/login",
                    lazy: async () => ({
                        Component: (await import("pages/login/login")).Login,
                        loader: (await import("pages/login/login.loader")).loginLoader
                    })
                }
            ]
        }
    ],
    {
        basename: import.meta.env.VITE_ROUTER_BASE_URL
    }
);

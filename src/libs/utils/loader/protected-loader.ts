import { hasEveryAuthority } from "libs/auth";
import { redirect } from "react-router-dom";
import type { Authority } from "types/auth";
import type {
    LoaderFunction,
    ProtectedLoaderFunction,
    ProtectedQueryLoaderFunction,
    QueryLoaderFunction
} from "types/loader";

export const protectedLoader = <D>(
    authorities: Authority[],
    loader: LoaderFunction<D>
): ProtectedLoaderFunction<D> => {
    return async args => {
        if (hasEveryAuthority(authorities)) {
            const loaderResult = await loader(args);

            return {
                ...loaderResult,
                authorities
            };
        }

        let redirectPath = new URL(args.request.url).pathname;

        const routerBaseUrl = import.meta.env.VITE_ROUTER_BASE_URL;
        if (routerBaseUrl && redirectPath?.startsWith(routerBaseUrl)) {
            redirectPath = redirectPath.substring(routerBaseUrl.length);
        }

        if (redirectPath.trim() === "") {
            return redirect("/login");
        }

        const searchParams = new URLSearchParams();

        searchParams.set("redirect", redirectPath);

        return redirect(`/login?${searchParams.toString()}`);
    };
};

export const protectedQueryLoader = <D>(
    authorities: Authority[],
    queryLoader: QueryLoaderFunction<D>
): ProtectedQueryLoaderFunction<D> => {
    return queryClient => protectedLoader(authorities, queryLoader(queryClient));
};

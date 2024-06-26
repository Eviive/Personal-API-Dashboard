import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { ProjectService } from "api/services/project";
import { protectedQueryLoader } from "libs/utils/loader/protected-loader";
import { queryLoader } from "libs/utils/loader/query-loader";
import { getNumberSearchParam } from "libs/utils/search-params";
import type { Project } from "types/entities/project";
import type { QueryLoaderFunction } from "types/loader";
import type { Page } from "types/pagination";

export const projectsQueryOptionsFn = (page?: number, size?: number, search?: string) =>
    queryOptions({
        queryKey: ["projects", page, size, search],
        queryFn: () => ProjectService.findPage(page, size, search),
        placeholderData: keepPreviousData
    });

export const projectsQueryLoader: QueryLoaderFunction<Page<Project> | null> =
    qC =>
    async ({ request }) => {
        const searchParams = new URL(request.url).searchParams;

        const page = getNumberSearchParam(searchParams, "page");
        const size = getNumberSearchParam(searchParams, "size");
        const search = searchParams.get("search") ?? undefined;

        const projectsQueryOptions = projectsQueryOptionsFn(page, size, search);

        return queryLoader(qC, projectsQueryOptions);
    };

export const projectsLoader = protectedQueryLoader(["read:project"], projectsQueryLoader);

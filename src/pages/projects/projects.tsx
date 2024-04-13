import { useMutationState, useQuery } from "@tanstack/react-query";
import { Page } from "components/common/page";
import { ProjectCard } from "components/projects/project-card";
import { ProjectFormDialog } from "components/projects/project-form-dialog";
import {
    ProjectSortDialog,
    sortProjectsMutationKey
} from "components/projects/project-sort-dialog";
import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { Button } from "components/ui/button";
import { SearchBar } from "components/ui/search-bar";
import { useSearchBar } from "hooks/use-search-bar";
import { Grid } from "layouts/grid";
import { getTitleAndDetail } from "libs/utils/error";
import type { projectsLoader } from "pages/projects/projects.loader";
import { projectsQueryOptions } from "pages/projects/projects.loader";
import type { FC } from "react";
import { useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import { LuAlertCircle } from "react-icons/lu";
import { MdDragHandle } from "react-icons/md";
import { useLoaderData } from "react-router-dom";
import type { DndItem } from "types/dnd";
import type { QueryLoaderFunctionData } from "types/loader";

export const Projects: FC = () => {
    const initialProjects = useLoaderData() as QueryLoaderFunctionData<typeof projectsLoader>;

    const query = useQuery({ ...projectsQueryOptions, initialData: initialProjects });

    const error = query.isError ? getTitleAndDetail(query.error) : null;

    const optimisticProjectSorts = useMutationState<DndItem[]>({
        filters: {
            mutationKey: sortProjectsMutationKey,
            status: "pending"
        },
        select: mutation => mutation.state.variables as DndItem[]
    });

    const optimisticProjectSortItems = useMemo(() => {
        const items: Record<number, number> = {};

        for (const sortItem of optimisticProjectSorts.flatMap(i => i)) {
            items[sortItem.id] = sortItem.sort;
        }

        return items;
    }, [optimisticProjectSorts]);

    const optimisticProjects = useMemo(() => {
        if (!query.isSuccess) return [];

        const optProjects = [...query.data];

        for (const project of optProjects) {
            if (optimisticProjectSortItems[project.id] !== undefined) {
                project.sort = optimisticProjectSortItems[project.id];
            }
        }

        optProjects.sort((a, b) => a.sort - b.sort);

        return optProjects;
    }, [query.data, query.isSuccess, optimisticProjectSortItems]);

    const { searchBarValue, setSearchBarValue, searchQuery, setSearchQuery } = useSearchBar();

    const optimisticFilteredProjects = useMemo(() => {
        return optimisticProjects.filter(project =>
            project.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );
    }, [optimisticProjects, searchQuery]);

    return (
        <Page title="Projects">
            <div className="flex h-full w-full grow flex-col gap-9 px-[5%] py-9">
                <div className="flex w-full max-w-md items-center gap-2 self-center">
                    <SearchBar
                        value={searchBarValue}
                        handleChange={setSearchBarValue}
                        handleDebounce={setSearchQuery}
                        isDisabled={query.isError}
                    />
                    <ProjectSortDialog
                        initialProjects={optimisticProjects}
                        trigger={
                            <Button
                                className="text-foreground-500"
                                variant="outline"
                                size="icon"
                                disabled={query.isError}
                            >
                                <MdDragHandle size={24} />
                            </Button>
                        }
                    />
                    <ProjectFormDialog
                        trigger={
                            <Button className="text-foreground-500" variant="outline" size="icon">
                                <FaPlus size={20} />
                            </Button>
                        }
                    />
                </div>
                {query.isSuccess && (
                    <Grid minWidth="350px" gap="2.5em" columnCount={3} centerHorizontally>
                        {optimisticFilteredProjects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                isOptimistic={optimisticProjectSortItems[project.id] !== undefined}
                            />
                        ))}
                    </Grid>
                )}
                {query.isError && error !== null && (
                    <Alert variant="destructive">
                        <LuAlertCircle className="h-4 w-4" />
                        <AlertTitle>{error.title}</AlertTitle>
                        <AlertDescription>{error.detail}</AlertDescription>
                    </Alert>
                )}
            </div>
        </Page>
    );
};

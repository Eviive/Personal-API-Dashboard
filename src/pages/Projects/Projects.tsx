import { useQueryClient } from "@tanstack/react-query";
import { ProjectService } from "api/services";
import { Loader, Page, SortableList, Toolbar } from "components/common";
import { ProjectCard, ProjectForm } from "components/projects";
import { useCustomQuery } from "hooks/useCustomQuery";
import { useDragAndDrop } from "hooks/useDragAndDrop";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { BsCheckLg } from "react-icons/bs";
import { FaPlus } from "react-icons/fa";
import { RxDragHandleDots2 } from "react-icons/rx";
import { Project } from "types/entities";

import styles from "./projects.module.scss";

type ProjectForm = {
    project?: Project;
    show: boolean;
};

export const Projects: FC = () => {
    const query = useCustomQuery([ "projects" ], ProjectService.findAll);

    const queryClient = useQueryClient();

    const handleSaveProjectsOrder = async (projects: Project[]) => {
        await ProjectService.saveAll(projects);
        await queryClient.invalidateQueries([ "projects" ]);
        toast.success("Projects order saved successfully!");
    };

    const {
        items: [ projectItems, setProjectItems ],
        dndState,
        handleToggleDnd,
        handleOnSetItems
    } = useDragAndDrop(query, handleSaveProjectsOrder);

    const [ projectForm, setProjectForm ] = useState<ProjectForm>({ show: false });

    const handleClose = (isTouched: boolean, isDeleted: boolean) => {
        isTouched && toast.success(`Project ${projectForm.project ? "updated" : "created"} successfully!`);
        isDeleted && toast.success("Project deleted successfully!");
        setProjectForm({ show: false });
    };

    return (
        <Page title="Projects">
            { query.isSuccess

                ? <div className={styles.projectsWrapper}>
                    {projectForm.show && <ProjectForm project={projectForm.project} handleClose={handleClose} />}
                    <SortableList
                        items={projectItems}
                        setItems={setProjectItems}
                        onSetItems={handleOnSetItems}
                        renderItem={project => (
                            <ProjectCard
                                project={project}
                                handleEdit={() => setProjectForm({ project, show: true })}
                                isDndActive={dndState.isDndActive}
                            />
                        )}
                        wrapperProps={{
                            className: styles.cardsWrapper,
                            size: "350px",
                            gap: "2.5em"
                        }}
                    />
                    <Toolbar
                        tools={[
                            {
                                handleClick: handleToggleDnd,
                                loading: dndState.isDndSubmitting,
                                children: dndState.isDndActive ? <BsCheckLg size={25} /> : <RxDragHandleDots2 size={25}/>
                            },
                            {
                                handleClick: () => setProjectForm({ show: true }),
                                children: <FaPlus size={22} />
                            }
                        ]}
                    />
                </div>

                : <Loader />
            }
        </Page>
    );
};

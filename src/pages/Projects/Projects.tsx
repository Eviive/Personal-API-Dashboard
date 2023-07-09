import { ProjectService } from "api/services";
import { Button, Loader, Page } from "components/common";
import { ProjectCard, ProjectForm } from "components/projects";
import { useCustomQuery } from "hooks/useCustomQuery";
import { GridLayout } from "layouts";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { Project } from "types/entities";

import styles from "./projects.module.scss";

type ProjectForm = {
    project?: Project;
    show: boolean;
};

export const Projects: FC = () => {

    const query = useCustomQuery(["projects"], ProjectService.findAll);

    const [ projectForm, setProjectForm ] = useState<ProjectForm>({ show: false });

    const handleClose = (madeChanges: boolean, deleted: boolean) => {
        madeChanges && toast.success(`Project ${projectForm.project ? "updated" : "created"} successfully!`);
        deleted && toast.success("Project deleted successfully!");
        setProjectForm({ show: false });
    };

    return (
        <Page title="Projects - Dashboard">
            { query.isSuccess

                ? <div className={styles.projectsWrapper}>
                    {projectForm.show && <ProjectForm project={projectForm.project} handleClose={handleClose} />}
                    <GridLayout className={styles.cardsWrapper} size="350px" gap="2.5em">
                        {query.data.map((project, index) => <ProjectCard key={index} project={project} handleEdit={() => setProjectForm({ project, show: true })} />)}
                    </GridLayout>
                    <Button className={styles.addButton} handleClick={() => setProjectForm({ show: true })}>
                        <FaPlus size={22} />
                    </Button>
                </div>

                : <Loader />
            }
        </Page>
    );
};

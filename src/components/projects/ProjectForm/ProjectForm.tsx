import { Button, ButtonGroup, Checkbox, Image, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImageService, ProjectService, SkillService } from "api/services";
import { ImageForm } from "components/image";
import { useFormSubmissionState } from "hooks/useFormSubmissionState";
import { SKILL_PLACEHOLDER } from "lib/constants";
import { getFormattedTitleAndMessage } from "lib/utils/error";
import type { FC } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { WithImageFile } from "types/entities";
import type { Project } from "types/entities/project";

type ProjectFormValues = WithImageFile<Project>;

type Props = {
    project: Project | null;
    numberOfProjects: number;
    handleClose: (isTouched: boolean, isDeleted: boolean) => void;
};

export const ProjectForm: FC<Props> = props => {

    const queryClient = useQueryClient();

    const [ submissionState, dispatchSubmissionState ] = useFormSubmissionState();

    const query = useQuery([ "skills" ], SkillService.findAll);

    const form = useForm<ProjectFormValues>({ defaultValues: props.project ?? undefined });
    const {
        handleSubmit,
        control,
        getValues,
        setValue,
        formState: { isDirty }
    } = form;

    const [ oldTitle, setOldTitle ] = useState(props.project?.title ?? "");

    const submitHandler: SubmitHandler<ProjectFormValues> = async data => {
        if (submissionState.isSubmittingEdition || submissionState.isSubmittingDeletion) return;
        if (!isDirty) return props.handleClose(false, false);
        dispatchSubmissionState("editionStarted");
        const editing = !!props.project;
        try {
            const project: Project = {
                ...data,
                image: {
                    id: data.image.id,
                    uuid: props.project?.image?.uuid,
                    altEn: data.image.altEn,
                    altFr: data.image.altFr
                }
            };
            if (!editing) {
                project.sort = props.numberOfProjects + 1;
            }

            const imageFile = data.image.file.item(0);
            if (imageFile?.size && imageFile?.size > 3 * 1024 * 1024) {
                toast.error("Image size cannot exceed 3MB");
                return;
            }

            if (editing) {
                await ProjectService.update(project, imageFile);
            } else {
                await ProjectService.save(project, imageFile);
            }

            await queryClient.invalidateQueries([ "projects" ]);
            console.log(`Project ${editing ? "updated" : "created"} successfully!`);
            props.handleClose(true, false);
        } catch (e) {
            console.error(editing ? "Project update failed" : "Project creation failed", getFormattedTitleAndMessage(e));
        } finally {
            dispatchSubmissionState("editionFinished");
        }
    };

    const handleDelete = async () => {
        if (submissionState.isSubmittingDeletion || submissionState.isSubmittingEdition) return;
        if (!props.project) return;
        dispatchSubmissionState("deletionStarted");
        try {
            await ProjectService.delete(props.project.id);
            await queryClient.invalidateQueries([ "projects" ]);
            console.log("Project deleted successfully!");
            props.handleClose(false, true);
        } catch (e) {
            console.error("Project deletion failed", getFormattedTitleAndMessage(e));
        } finally {
            dispatchSubmissionState("deletionFinished");
        }
    };

    return (
        <FormProvider {...form}>
            <form
                className="mb-2 flex flex-col gap-4 items-center"
                onSubmit={handleSubmit(submitHandler)}
            >
                <Controller
                    name="title"
                    control={control}
                    rules={{
                        required: "Title is required",
                        maxLength: {
                            value: 50,
                            message: `Title cannot exceed 50 characters (currently ${getValues("title")?.length})`
                        },
                        onChange: () => {
                            const [ title, altEn, altFr ] = getValues([ "title", "image.altEn", "image.altFr" ]),
                                  isNameEmpty = !title.trim(),
                                  isAltEnEmpty = !altEn.trim(),
                                  isAltFrEmpty = !altFr.trim(),
                                  isAltEnFormatted = altEn === `${oldTitle.trim()}'s logo`,
                                  isAltFrFormatted = altFr === `Logo de ${oldTitle.trim()}`;

                            (isAltEnEmpty || isAltEnFormatted) && setValue("image.altEn", isNameEmpty ? "" : `${title.trim()}'s logo`);
                            (isAltFrEmpty || isAltFrFormatted) && setValue("image.altFr", isNameEmpty ? "" : `Logo de ${title.trim()}`);

                            setOldTitle(title);
                        }
                    }}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                        <Input
                            {...field}
                            label="Title"
                            errorMessage={fieldState.error?.message}
                            isRequired
                            isDisabled={field.disabled}
                        />
                    )}
                />

                <Controller
                    name="descriptionEn"
                    control={control}
                    rules={{
                        required: "English description is required",
                        maxLength: {
                            value: 510,
                            message: `English description cannot exceed 510 characters (currently ${getValues("descriptionEn")?.length})`
                        }
                    }}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                        <Textarea
                            {...field}
                            label="English description"
                            maxRows={3}
                            errorMessage={fieldState.error?.message}
                            isRequired
                            isDisabled={field.disabled}
                        />
                    )}
                />

                <Controller
                    name="descriptionFr"
                    control={control}
                    rules={{
                        required: "French description is required",
                        maxLength: {
                            value: 510,
                            message: `French description cannot exceed 510 characters (currently ${getValues("descriptionFr")?.length})`
                        }
                    }}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                        <Textarea
                            {...field}
                            label="French description"
                            maxRows={3}
                            errorMessage={fieldState.error?.message}
                            isRequired
                            isDisabled={field.disabled}
                        />
                    )}
                />

                <Controller
                    name="creationDate"
                    control={control}
                    rules={{
                        required: "Creation date is required"
                    }}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                        <Input
                            {...field}
                            type="date"
                            label="Creation date"
                            errorMessage={fieldState.error?.message}
                            isRequired
                            isDisabled={field.disabled}
                        />
                    )}
                />

                <Controller
                    name="repoUrl"
                    control={control}
                    rules={{
                        required: "Repository URL is required",
                        maxLength: {
                            value: 255,
                            message: `Repository URL cannot exceed 255 characters (currently ${getValues("repoUrl")?.length})`
                        }
                    }}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                        <Input
                            {...field}
                            type="url"
                            label="Repository URL"
                            errorMessage={fieldState.error?.message}
                            isRequired
                            isDisabled={field.disabled}
                        />
                    )}
                />

                <Controller
                    name="demoUrl"
                    control={control}
                    rules={{
                        required: "Demonstration URL is required",
                        maxLength: {
                            value: 255,
                            message: `Demonstration URL cannot exceed 255 characters (currently ${getValues("demoUrl")?.length})`
                        }
                    }}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                        <Input
                            {...field}
                            type="url"
                            label="Demonstration URL"
                            errorMessage={fieldState.error?.message}
                            isRequired
                            isDisabled={field.disabled}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="skills"
                    defaultValue={[]}
                    render={({ field, fieldState }) => (
                        <Select
                            ref={field.ref}
                            name={field.name}
                            label="Skills"
                            selectionMode="multiple"
                            items={query.isSuccess ? query.data : []}
                            selectedKeys={query.isSuccess ? field.value.map(s => s.id.toString()) : []}
                            onSelectionChange={selection => {
                                if (!query.isSuccess) return;

                                if (selection === "all") {
                                    field.onChange(query.data);
                                    return;
                                }

                                field.onChange(
                                    query.data.filter(s =>
                                        selection.has(s.id) ||
                                        selection.has(s.id.toString())
                                    ) ?? []
                                );
                            }}
                            onBlur={field.onBlur}
                            errorMessage={fieldState.error?.message}
                            isLoading={query.isLoading}
                            disabled={!query.isSuccess || field.disabled}
                            isDisabled={!query.isSuccess || field.disabled}
                        >
                            {skill => (
                                <SelectItem
                                    key={skill.id}
                                    value={skill.id}
                                    textValue={skill.name}
                                >
                                    <div className="flex items-center gap-2">
                                        <Image
                                            key={skill.id}
                                            className="object-cover aspect-square drop-shadow-[0_1px_1px_hsl(0deg,0%,0%,0.5)]"
                                            src={ImageService.getImageUrl(skill.image) ?? SKILL_PLACEHOLDER}
                                            alt={skill.image.altEn}
                                            width={22}
                                            radius="none"
                                            loading="lazy"
                                        />
                                        {skill.name}
                                    </div>
                                </SelectItem>
                            )}
                        </Select>
                    )}
                />

                <ImageForm />

                <Controller
                    name="featured"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <Checkbox
                            ref={field.ref}
                            name={field.name}
                            checked={field.value}
                            onChange={v => field.onChange(v.target.checked)}
                            onBlur={field.onBlur}
                            disabled={field.disabled}
                            isDisabled={field.disabled}
                        >
                            Featured
                        </Checkbox>
                    )}
                />

                <ButtonGroup className="w-full">
                    {!!props.project && (
                        <Button
                            className="w-full"
                            color="danger"
                            isLoading={submissionState.isSubmittingDeletion}
                            onPress={handleDelete}
                        >
                            Delete
                        </Button>
                    )}
                    <Button
                        className="w-full"
                        type="submit"
                        isLoading={submissionState.isSubmittingEdition}
                    >
                        Submit
                    </Button>
                </ButtonGroup>
            </form>
        </FormProvider>
    );
};

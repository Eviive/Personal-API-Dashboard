import { Button, ButtonGroup, Input } from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { SkillService } from "api/services";
import { ImageForm } from "components/image";
import { useFormSubmissionState } from "hooks/useFormSubmissionState";
import { getTitleAndMessage } from "libs/utils";
import type { FC } from "react";
import { useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type { Skill, WithImageFile } from "types/entities";

type SkillFormValue = WithImageFile<Skill>;

type Props = {
    skill: Skill | null;
    numberOfSkills: number;
    handleClose: (isTouched: boolean, isDeleted: boolean) => void;
};

export const SkillForm: FC<Props> = props => {

    const queryClient = useQueryClient();

    const [ submissionState, dispatchSubmissionState ] = useFormSubmissionState();

    const form = useForm<SkillFormValue>({ defaultValues: props.skill ?? undefined });
    const {
        handleSubmit,
        getValues,
        setValue,
        control,
        formState: { isDirty }
    } = form;

    const [ oldName, setOldName ] = useState(props.skill?.name ?? "");

    const submitHandler: SubmitHandler<SkillFormValue> = async data => {
        if (submissionState.isSubmittingEdition || submissionState.isSubmittingDeletion) return;
        if (!isDirty) return props.handleClose(false, false);
        dispatchSubmissionState("editionStarted");
        const editing = !!props.skill;
        try {
            const skill: Skill = {
                ...data,
                image: {
                    id: data.image.id,
                    uuid: props.skill?.image?.uuid,
                    altEn: data.image.altEn,
                    altFr: data.image.altFr
                }
            };
            if (!editing) {
                skill.sort = props.numberOfSkills + 1;
            }

            const imageFile = data.image.file.item(0);

            if (editing) {
                await SkillService.update(skill, imageFile);
            } else {
                await SkillService.save(skill, imageFile);
            }

            await queryClient.invalidateQueries([ "skills" ]);
            console.log(`Skill ${editing ? "updated" : "created"} successfully!`);
            props.handleClose(true, false);
        } catch (e) {
            console.error(editing ? "Skill update failed" : "Skill creation failed", getTitleAndMessage(e));
        } finally {
            dispatchSubmissionState("editionFinished");
        }
    };

    const handleDelete = async () => {
        if (submissionState.isSubmittingDeletion || submissionState.isSubmittingEdition) return;
        if (!props.skill) return;
        dispatchSubmissionState("deletionStarted");
        try {
            await SkillService.delete(props.skill.id);
            await queryClient.invalidateQueries([ "skills" ]);
            console.log("Skill deleted successfully!");
            props.handleClose(false, true);
        } catch (e) {
            console.error("Skill deletion failed", getTitleAndMessage(e));
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
                    name="name"
                    control={control}
                    rules={{
                        required: "Name is required",
                        maxLength: {
                            value: 50,
                            message: `Name cannot exceed 50 characters (currently ${getValues("name")?.length})`
                        },
                        onChange: () => {
                            const [ name, altEn, altFr ] = getValues([ "name", "image.altEn", "image.altFr" ]),
                                  isNameEmpty = !name.trim(),
                                  isAltEnEmpty = !altEn.trim(),
                                  isAltFrEmpty = !altFr.trim(),
                                  isAltEnFormatted = altEn === `${oldName.trim()}'s logo`,
                                  isAltFrFormatted = altFr === `Logo de ${oldName.trim()}`;

                            (isAltEnEmpty || isAltEnFormatted) && setValue("image.altEn", isNameEmpty ? "" : `${name.trim()}'s logo`);
                            (isAltFrEmpty || isAltFrFormatted) && setValue("image.altFr", isNameEmpty ? "" : `Logo de ${name.trim()}`);

                            setOldName(name);
                        }
                    }}
                    defaultValue=""
                    render={({ field, fieldState }) => (
                        <Input
                            {...field}
                            label="Name"
                            errorMessage={fieldState.error?.message}
                            isRequired
                            isDisabled={field.disabled}
                        />
                    )}
                />

                <ImageForm />

                <ButtonGroup className="w-full">
                    {!!props.skill && (
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

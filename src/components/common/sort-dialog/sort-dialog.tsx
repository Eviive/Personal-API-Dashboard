import type { UseMutationResult } from "@tanstack/react-query";
import type { SortDialogContentRef } from "components/common/sort-dialog/sort-dialog-content";
import { SortDialogContextProvider } from "components/common/sort-dialog/sort-dialog-context";
import { ResponsiveDrawerDialog } from "components/ui/responsive-drawer-dialog";
import type { FC, ReactNode } from "react";
import { useRef, useState } from "react";
import type { DndItem } from "types/dnd";

type Props = {
    itemsName: string;
    trigger: ReactNode;
    content: ReactNode;
    mutation: UseMutationResult<void, Error, DndItem[]>;
};

export const SortDialog: FC<Props> = props => {
    const [open, setOpen] = useState(false);

    const contentRef = useRef<SortDialogContentRef>(null);

    const handleClose = (open: boolean, resetSort?: boolean) => {
        if (!open && !resetSort) {
            const sorts = contentRef.current?.();

            if (sorts) {
                props.mutation.mutate(sorts);
            }
        }

        setOpen(open);
    };

    return (
        <ResponsiveDrawerDialog
            trigger={props.trigger}
            header={{
                title: `Sorting ${props.itemsName}`
            }}
            content={
                <SortDialogContextProvider
                    value={{
                        contentRef,
                        handleClose
                    }}
                >
                    {props.content}
                </SortDialogContextProvider>
            }
            open={open}
            onOpenChange={handleClose}
        />
    );
};

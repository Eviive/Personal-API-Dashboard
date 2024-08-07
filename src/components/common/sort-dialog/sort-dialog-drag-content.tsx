import type { Active, DragEndEvent } from "@dnd-kit/core";
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from "@dnd-kit/sortable";
import type { SortDialogContentRef } from "components/common/sort-dialog/sort-dialog-content";
import { SortDialogDragHandle } from "components/common/sort-dialog/sort-dialog-drag-handle";
import { SortDialogItem } from "components/common/sort-dialog/sort-dialog-item";
import { SortDialogOverlay } from "components/common/sort-dialog/sort-dialog-overlay";
import { ScrollArea } from "components/ui/scroll-area";
import { Separator } from "components/ui/separator";
import type {
    Dispatch,
    ForwardedRef,
    PropsWithoutRef,
    ReactNode,
    RefAttributes,
    SetStateAction
} from "react";
import { forwardRef, Fragment, useImperativeHandle, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import type { DndItem } from "types/dnd";

type Props<E extends DndItem> = {
    items: E[];
    setItems: Dispatch<SetStateAction<E[]>>;
    render: (item: E) => ReactNode;
};

const SortDialogDragContent = <E extends DndItem>(
    props: Props<E>,
    ref: ForwardedRef<SortDialogContentRef>
) => {
    const [initialSort] = useState(props.items.map(item => item.sort));

    useImperativeHandle(ref, () => {
        return () => {
            const firstMovedIndex = props.items.findIndex(
                (item, i) => item.sort !== initialSort[i]
            );
            const lastMovedItem =
                firstMovedIndex !== -1
                    ? props.items.findLastIndex((item, i) => item.sort !== initialSort[i])
                    : -1;

            if (firstMovedIndex === -1 || lastMovedItem === -1) return null;

            const movedItems = props.items.slice(firstMovedIndex, lastMovedItem + 1);

            const sorts = movedItems.map(item => item.sort).sort((a, b) => a - b);

            return movedItems.map((item, i) => ({
                id: item.id,
                sort: sorts[i]
            }));
        };
    }, [props.items, initialSort]);

    const [active, setActive] = useState<Active | null>(null);

    const activeItem = useMemo(
        () => props.items.find(item => item.id === active?.id),
        [props.items, active]
    );

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;

        if (over && active.id !== over.id) {
            props.setItems(prevItems => {
                const activeIndex = prevItems.findIndex(item => item.id === active.id);
                const overIndex = prevItems.findIndex(item => item.id === over.id);

                return arrayMove(prevItems, activeIndex, overIndex);
            });
        }

        setActive(null);
    };

    return (
        <DndContext
            sensors={sensors}
            modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
            onDragStart={({ active }) => setActive(active)}
            onDragCancel={() => setActive(null)}
            onDragEnd={handleDragEnd}
        >
            <SortableContext items={props.items} strategy={verticalListSortingStrategy}>
                <ScrollArea className="h-full w-full">
                    <ul className="mr-[calc(var(--scrollbar-size)*1.5)]">
                        {props.items.map((item, i) => (
                            <Fragment key={item.id}>
                                <Separator />
                                <SortDialogItem id={item.id}>
                                    {props.render(item)}
                                    <SortDialogDragHandle />
                                </SortDialogItem>
                                {i === props.items.length - 1 && <Separator />}
                            </Fragment>
                        ))}
                    </ul>
                </ScrollArea>
            </SortableContext>
            {createPortal(
                <SortDialogOverlay>
                    {!!activeItem && (
                        <>
                            <Separator />
                            <SortDialogItem id={activeItem.id} isOverlay>
                                {props.render(activeItem)}
                                <SortDialogDragHandle />
                            </SortDialogItem>
                            <Separator />
                        </>
                    )}
                </SortDialogOverlay>,
                document.body
            )}
        </DndContext>
    );
};

const SortDialogDragContentWithForwardedRef = forwardRef(SortDialogDragContent) as <
    E extends DndItem
>(
    props: PropsWithoutRef<Props<E>> & RefAttributes<SortDialogContentRef>
) => ReactNode;

export { SortDialogDragContentWithForwardedRef as SortDialogDragContent };

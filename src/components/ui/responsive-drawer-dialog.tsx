import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "components/ui/drawer";
import { useMediaQuery } from "hooks/use-media-query";
import type { FC, ReactNode } from "react";

type Props = {
    trigger: ReactNode;
    header: {
        title: ReactNode;
        description?: ReactNode;
    };
    content: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    classNames?: {
        dialog?: {
            content?: string;
        };
    };
};

export const ResponsiveDrawerDialog: FC<Props> = props => {
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Dialog open={props.open} onOpenChange={props.onOpenChange}>
                <DialogTrigger asChild>{props.trigger}</DialogTrigger>
                <DialogContent className={props.classNames?.dialog?.content}>
                    <DialogHeader>
                        <DialogTitle>{props.header.title}</DialogTitle>
                        {props.header.description && (
                            <DialogDescription>{props.header.description}</DialogDescription>
                        )}
                    </DialogHeader>
                    {props.content}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={props.open} onOpenChange={props.onOpenChange} shouldScaleBackground>
            <DrawerTrigger asChild>{props.trigger}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>{props.header.title}</DrawerTitle>
                    {props.header.description && (
                        <DrawerDescription>{props.header.description}</DrawerDescription>
                    )}
                </DrawerHeader>
                {props.content}
            </DrawerContent>
        </Drawer>
    );
};

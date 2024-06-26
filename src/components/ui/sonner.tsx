"use client";

import { useThemeContext } from "contexts/theme-context";
import { cn } from "libs/utils/style";
import type { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({ className, toastOptions, ...props }: ToasterProps) => {
    const { theme } = useThemeContext();
    return (
        <Sonner
            theme={theme}
            className={cn(className, "toaster group")}
            toastOptions={{
                ...toastOptions,
                classNames: {
                    toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:shadow-lg group-[.toaster]:pointer-events-auto",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
                }
            }}
            {...props}
        />
    );
};

export { Toaster };

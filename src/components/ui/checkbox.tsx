"use client";

import { Indicator, Root } from "@radix-ui/react-checkbox";
import { cn } from "libs/utils/style";
import type { ComponentPropsWithoutRef, ElementRef } from "react";
import { forwardRef } from "react";
import { LuCheck } from "react-icons/lu";

const Checkbox = forwardRef<ElementRef<typeof Root>, ComponentPropsWithoutRef<typeof Root>>(
    ({ className, ...props }, ref) => (
        <Root
            ref={ref}
            className={cn(
                "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
                className
            )}
            {...props}
        >
            <Indicator className={cn("flex items-center justify-center text-current")}>
                <LuCheck className="h-4 w-4" />
            </Indicator>
        </Root>
    )
);

Checkbox.displayName = Root.displayName;

export { Checkbox };

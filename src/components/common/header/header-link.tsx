import type { HeaderType } from "components/common/header/header";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import type { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";

type Props = {
    type: HeaderType;
    title: string;
    to: string;
    icon: ReactNode;
    className?: string | (({ isActive }: { isActive: boolean }) => string);
};

export const HeaderLink: FC<Props> = props => {
    if (props.type === "header") {
        return (
            <NavLink to={props.to} className={props.className}>
                {props.icon}
                <span className="truncate">{props.title}</span>
            </NavLink>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    {/* This div is necessary in order for the NavLink's className function to work */}
                    <div>
                        <NavLink to={props.to} className={props.className}>
                            {props.icon}
                            <span className="sr-only">{props.title}</span>
                        </NavLink>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="right">{props.title}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
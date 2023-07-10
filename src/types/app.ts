import { ReactNode } from "react";

export type Route = {
    path: string;
    name: string;
    icon: ReactNode;
};

export type Falsy = false | 0 | "" | null | undefined;

export type ErrorResponse = {
    status: number;
    error: string;
    message: string | string[];
};

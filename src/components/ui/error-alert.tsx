import { Alert, AlertDescription, AlertTitle } from "components/ui/alert";
import { getTitleAndDetail } from "libs/utils/error";
import type { FC } from "react";
import { LuAlertCircle } from "react-icons/lu";

type Props = {
    error: Error;
};

export const ErrorAlert: FC<Props> = ({ error }) => {
    const { title, detail } = getTitleAndDetail(error);

    return (
        <Alert variant="destructive">
            <LuAlertCircle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{detail}</AlertDescription>
        </Alert>
    );
};

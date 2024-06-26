import { useCommandState } from "cmdk";
import { CommandEmpty } from "components/ui/command";
import type { FC } from "react";
import type { PropsWithStatus } from "types/utils/props";

export const ComboboxEmpty: FC<PropsWithStatus> = props => {
    const search = useCommandState(state => state.search);

    return (
        <CommandEmpty>
            {props.empty}
            {props.loading}
            {props.error}
            {search && props.empty === false && `No results found for "${search}".`}
        </CommandEmpty>
    );
};

import { ImageService } from "api/services";
import { SortableDragHandle, SortableItem } from "components/common";
import { FC } from "react";
import { Skill } from "types/entities";
import { SKILL_PLACEHOLDER } from "utils/entities";

import styles from "./skill-card.module.scss";

type Props = {
    skill: Skill;
    handleAction: () => void;
    isDndActive: boolean;
};

export const SkillCard: FC<Props> = props => {
    return (
        <SortableItem
            id={props.skill.id}
            itemProps={{
                className: styles.card,
                onClick: props.handleAction
            }}
        >
            {props.isDndActive && <SortableDragHandle className={styles.dragHandle} />}
            <div className={styles.cardImage}>
                <img
                    src={ImageService.getImageUrl(props.skill.image) ?? SKILL_PLACEHOLDER}
                    alt={props.skill.image.alt}
                    title={props.skill.name}
                    onError={e => e.currentTarget.src = SKILL_PLACEHOLDER}
                    loading="lazy"
                />
            </div>
            <div className={styles.cardContent}>
                {props.skill.name}
            </div>
        </SortableItem>
    );
};

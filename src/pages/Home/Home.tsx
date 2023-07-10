import { HealthService } from "api/services";
import { Loader, Page } from "components/common";
import { StatusCards } from "components/home";
import { useCustomQuery } from "hooks/useCustomQuery";
import { FC } from "react";

import styles from "./home.module.scss";

export const Home: FC = () => {

    const queryInfo = useCustomQuery([ "info" ], HealthService.info);
    const queryHealth = useCustomQuery([ "health" ], HealthService.health);

    return (
        <Page title="Home">
            { (queryInfo.isSuccess && queryHealth.isSuccess)

                ? <div className={styles.homeWrapper}>
                    <div className={styles.homeContent}>
                        <div className={styles.homeHeader}>
                            <h1>Welcome to the <strong>{queryInfo.data.app.name}</strong> dashboard !</h1>
                            <h2>{queryInfo.data.app.stage.toUpperCase()} v{queryInfo.data.app.version}</h2>
                            <p>{queryInfo.data.app.description}</p>
                        </div>
                        <StatusCards data={queryHealth.data} />
                    </div>
                </div>

                : <Loader />
            }
        </Page>
    );
};

import { Modal } from "components/common";
import { FC, ReactNode, useState } from "react";
import { HttpExchange } from "types/health";
import { formatClassNames } from "utils/components";

import styles from "./trace-details.module.scss";

type Props = {
    trace: HttpExchange;
    handleClose: () => void;
};

export const TraceDetails: FC<Props> = ({ trace, handleClose }) => {

    const [ content, setContent ] = useState<"request" | "response">("request");

    const parseObject = (obj: object): ReactNode => {
        return Object.entries(obj).map(([ key, val ], index) => {
            if (Array.isArray(val) || !(val instanceof Object)) {
                return <span key={index}><strong>{key}:</strong> {Array.isArray(val) ? val.join(" ") : val}</span>;
            } else {
                return parseObject(val);
            }
        });
    };

    return (
        <Modal title="HTTP Trace Details" handleClose={handleClose}>
            <div className={styles.detailsSwitch}>
                <button
                    className={formatClassNames(content === "request" && styles.active)}
                    onClick={() => setContent("request")}>
                    Request
                </button>
                <button
                    className={formatClassNames(content === "response" && styles.active)}
                    onClick={() => setContent("response")}>
                    Response
                </button>
            </div>
            <div className={styles.detailsContent}>
                {content === "request"

                    ? <>
                        <span><strong>Timestamp:</strong> {new Intl.DateTimeFormat("en-GB", { dateStyle: "full", timeStyle: "short" }).format(new Date(trace.timestamp))}</span>
                        <span><strong>Time taken:</strong> {Math.trunc(parseFloat(trace.timeTaken.substring(2, trace.timeTaken.length - 1)) * 1000)} ms</span>
                        {!!trace.principal && <span><strong>Principal:</strong> {trace.principal.name}</span>}
                        {parseObject(trace.request)}
                    </>

                    : parseObject(trace.response)
                }
            </div>
        </Modal>
    );
};

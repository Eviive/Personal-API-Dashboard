import { request } from "api/client";
import { AuditEvent, Health, HttpExchange, Info } from "types/health";

const URL = "actuator";

const auditEvents = () => request<{ events: AuditEvent[] }>(`/${URL}/auditevents`);

const health = () => request<Health>(`/${URL}/health`);

const httpExchanges = () => request<{ traces: HttpExchange[] }>(`/${URL}/httpexchanges`);

const info = () => request<Info>(`/${URL}/info`);

const logFile = () => request<string>(`/${URL}/logfile`, {
    headers: {
        "Accept": "text/plain;charset=UTF-8"
    }
});

const shutdown = () => request<{ message: string }>(`/${URL}/shutdown`, {
    method: "POST"
});

export const HealthService = {
    auditEvents,
    health,
    httpExchanges,
    info,
    logFile,
    shutdown
};
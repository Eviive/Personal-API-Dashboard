import { request } from "api/client";
import type { Health, HttpExchange, Info } from "types/health";

const URL = "actuator";

const info = () => request<Info>(`/${URL}/info`);

const health = () => request<Health>(`/${URL}/health`);

const httpExchanges = async (): Promise<HttpExchange[]> => {
    const data = await request<{ exchanges: HttpExchange[] }>(`/${URL}/httpexchanges`, {
        requiredAuthorities: ["read:actuator"]
    });

    return data.exchanges.map(exchange => ({
        ...exchange,
        uuid: crypto.randomUUID()
    }));
};

export const HealthService = {
    info,
    health,
    httpExchanges
};

export interface HealthResponse {
    status: "ok";
    timestamp: string;
}
export interface ConnectionReadyPayload {
    socketId: string;
    connectedAt: string;
}
export interface InteractionProperties {
    x: number;
    y: number;
    noiseX: number;
    noiseY: number;
    speed: number;
    connectionIds: string[];
}
export interface Interaction {
    title: string;
    instanceId: number;
    description: string;
    id: string;
    shape: string;
    properties: InteractionProperties;
}
export interface CreativePingPayload extends Interaction {
    userId: string;
    sentAt: string;
}
export interface CreativePongPayload extends CreativePingPayload {
    receivedAt: string;
}
export interface InteractionRejectedPayload {
    message: string;
    retryAfterMs: number;
}
export interface ServerToClientEvents {
    "connection:ready": (payload: ConnectionReadyPayload) => void;
    "creative:pong": (payload: CreativePongPayload) => void;
    "interaction:created": (payload: CreativePingPayload) => void;
    "interaction:rejected": (payload: InteractionRejectedPayload) => void;
}
export interface ClientToServerEvents {
    "creative:ping": (payload: CreativePingPayload) => void;
}
export interface InterServerEvents {
    ping: () => void;
}
export interface SocketData {
    connectedAt: string;
}
//# sourceMappingURL=index.d.ts.map
import { useEffect, useState } from "react";
import { socket } from "../lib/socket";

export type SocketConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected";

export function useSocketConnection(): SocketConnectionStatus {
  const [status, setStatus] = useState<SocketConnectionStatus>(
    socket.connected ? "connected" : "connecting",
  );

  useEffect(() => {
    const handleConnect = () => setStatus("connected");
    const handleDisconnect = () => setStatus("disconnected");

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  return status;
}

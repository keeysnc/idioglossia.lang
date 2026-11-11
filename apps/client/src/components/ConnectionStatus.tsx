import type { SocketConnectionStatus } from "../hooks/useSocketConnection";

interface ConnectionStatusProps {
  status: SocketConnectionStatus;
}

const labels: Record<SocketConnectionStatus, string> = {
  connecting: "Connecting",
  connected: "Live",
  disconnected: "Offline",
};

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  return (
    <p className={`connection-status connection-status--${status}`} role="status">
      <span aria-hidden="true" className="connection-status__dot" />
      {labels[status]}
    </p>
  );
}

import { createContext } from "react";
import type { Socket } from "socket.io-client";
import { socket } from "../../lib/socket";
export const SocketContext = createContext<{ socket: Socket | null }>({ socket: socket });

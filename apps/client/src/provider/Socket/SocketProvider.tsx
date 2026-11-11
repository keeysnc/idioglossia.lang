import { useEffect } from "react";
import { SocketContext } from "./SocketContext";
import { socket } from "../../lib/socket";

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
	useEffect(() => {
		socket.connect();

		return () => {
			socket.disconnect();
		};
	}, []);

	return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export default SocketProvider;

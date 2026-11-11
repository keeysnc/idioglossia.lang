import { useContext } from "react";
import { SocketContext } from "../provider/Socket/SocketContext";

const useUserInteractionId = () => {
	const { socket } = useContext(SocketContext);
	return socket?.id;
};

export default useUserInteractionId;

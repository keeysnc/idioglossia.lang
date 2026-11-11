import { SocketContext } from "../provider/Socket/SocketContext";
import type { CreativePingPayload } from "@creative/shared";
import { useContext, useEffect, useState } from "react";
import { interactionData } from "../data/interactions";
import P5Canvas from "../components/P5Canvas";

const RESET_INTERVAL_MS = 5 * 60 * 1000;

const InteractionViewer = () => {
	const { socket } = useContext(SocketContext);
	const [interactions, setInteractions] = useState<CreativePingPayload[]>([]);
	const [canvasVersion, setCanvasVersion] = useState(0);

	useEffect(() => {
		if (!socket) {
			return;
		}

		const handleInteractionCreated = (payload: CreativePingPayload) => {
			setInteractions((currentInteractions) => [...currentInteractions, payload]);
		};

		socket.on("interaction:created", handleInteractionCreated);

		return () => {
			socket.off("interaction:created", handleInteractionCreated);
		};
	}, [socket, interactions]);

	useEffect(() => {
		const resetInterval = window.setInterval(() => {
			setInteractions([]);
			setCanvasVersion((version) => version + 1);
		}, RESET_INTERVAL_MS);

		return () => {
			window.clearInterval(resetInterval);
		};
	}, []);

	if (!socket) {
		throw new Error("Socket not available");
	}

	return (
		// <div className="canvas-container">
		// 	{/* {interactions.map((interaction) => (
		// 		<div key={`${interaction.userId}-${interaction.sentAt}`}>{interaction.shape}</div>
		// 	))}
		// 	{seedArray.map((interaction) => (
		// 		<div key={`${interaction.userId}-${interaction.sentAt}`}>{interaction.shape}</div>
		// 	))} */}
		// </div>
		<main className="interactionViewerPage">
			<P5Canvas key={canvasVersion} interactionData={interactionData} submittedInteractions={interactions} />
		</main>
	);
};

export default InteractionViewer;

import { SocketContext } from "../provider/Socket/SocketContext";
import type { CreativePingPayload } from "@creative/shared";
import { useContext, useEffect, useState } from "react";
import { interactionData } from "../data/interactions";
import P5Canvas from "../components/P5Canvas";

const RESET_INTERVAL_MS = 5 * 60 * 1000;
const VIEWER_SESSION_KEY = "idioglossia-viewer-session";

type ViewerSession = {
	resetAt: number;
	interactions: CreativePingPayload[];
};

function saveSession(session: ViewerSession) {
	try {
		window.sessionStorage.setItem(VIEWER_SESSION_KEY, JSON.stringify(session));
	} catch {}
}

function loadSession(): ViewerSession {
	try {
		const stored = window.sessionStorage.getItem(VIEWER_SESSION_KEY);
		if (stored) {
			const session = JSON.parse(stored) as ViewerSession;
			if (Number.isFinite(session.resetAt) && session.resetAt > Date.now() && Array.isArray(session.interactions)) {
				return session;
			}
		}
	} catch {}
	const session = { resetAt: Date.now() + RESET_INTERVAL_MS, interactions: [] };
	saveSession(session);
	return session;
}

const InteractionViewer = () => {
	const { socket } = useContext(SocketContext);
	const [session, setSession] = useState<ViewerSession>(loadSession);
	const [canvasVersion, setCanvasVersion] = useState(0);

	useEffect(() => {
		if (!socket) {
			return;
		}

		const handleInteractionCreated = (payload: CreativePingPayload) => {
			setSession((current) => {
				const next = { ...current, interactions: [...current.interactions, payload] };
				saveSession(next);
				return next;
			});
		};

		socket.on("interaction:created", handleInteractionCreated);

		return () => {
			socket.off("interaction:created", handleInteractionCreated);
		};
	}, [socket]);

	useEffect(() => {
		const resetTimeout = window.setTimeout(
			() => {
				const next = { resetAt: Date.now() + RESET_INTERVAL_MS, interactions: [] };
				saveSession(next);
				setSession(next);
				setCanvasVersion((version) => version + 1);
			},
			Math.max(0, session.resetAt - Date.now()),
		);

		return () => {
			window.clearTimeout(resetTimeout);
		};
	}, [session.resetAt]);

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
			<P5Canvas key={canvasVersion} interactionData={interactionData} submittedInteractions={session.interactions} />
		</main>
	);
};

export default InteractionViewer;

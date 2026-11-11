import InteractionElement from "../components/interactionElement/InteractionElement";
import { useContext, useEffect, useRef, useState } from "react";
import { InteractionContext } from "../provider/Interactions/InteractionContext";
import useUserInteractionId from "../hooks/useUserInteractionId";
import { SocketContext } from "../provider/Socket/SocketContext";
import { interactionData } from "../data/interactions";
import type { CreativePingPayload, InteractionRejectedPayload } from "@creative/shared";
import { InteractiveLibraryHeader } from "../components/header/Header";

const InteractionLibrary = () => {
	const { selectedInteractionId, setSelectedInteractionId } = useContext(InteractionContext);
	const { socket } = useContext(SocketContext);
	const userInteractionId = useUserInteractionId();
	const [submissionToast, setSubmissionToast] = useState<{ message: string; variant: "error" | "success" } | null>(null);
	const [showViewerPrompt, setShowViewerPrompt] = useState(true);
	const viewerPromptRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!submissionToast) {
			return;
		}

		const timeout = window.setTimeout(() => {
			setSubmissionToast(null);
		}, 3000);

		return () => {
			window.clearTimeout(timeout);
		};
	}, [submissionToast]);

	useEffect(() => {
		if (!socket) {
			return;
		}

		const handleInteractionRejected = (payload: InteractionRejectedPayload) => {
			setSubmissionToast({ message: payload.message, variant: "error" });
		};

		socket.on("interaction:rejected", handleInteractionRejected);
		return () => {
			socket.off("interaction:rejected", handleInteractionRejected);
		};
	}, [socket]);

	useEffect(() => {
		if (showViewerPrompt) {
			viewerPromptRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
		}
	}, [showViewerPrompt]);

	const handleViewerPromptKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Escape") {
			setShowViewerPrompt(false);
			return;
		}

		if (event.key !== "Tab") {
			return;
		}

		const focusableElements = viewerPromptRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
		if (!focusableElements?.length) {
			return;
		}

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];
		if (event.shiftKey && document.activeElement === firstElement) {
			event.preventDefault();
			lastElement.focus();
		} else if (!event.shiftKey && document.activeElement === lastElement) {
			event.preventDefault();
			firstElement.focus();
		}
	};

	if (!socket) {
		throw new Error("Socket not available");
	}

	const handleSubmit = () => {
		setSelectedInteractionId(selectedInteractionId);

		const selectedInteraction = interactionData.find((interaction) => interaction.id === selectedInteractionId);
		if (!selectedInteraction) {
			throw new Error("Select an interaction before submitting");
		}
		if (!userInteractionId) {
			throw new Error("User interaction ID is unavailable");
		}

		const userPayload: CreativePingPayload = {
			...selectedInteraction,
			instanceId: Math.random() * 200,
			userId: userInteractionId,
			sentAt: new Date().toISOString(),
		};
		socket.emit("creative:ping", userPayload);
		setSubmissionToast({ message: "You've submitted", variant: "success" });
	};

	return (
		<main className="cover">
			<div className="interactionLibrary">
				{showViewerPrompt && (
					<div
						ref={viewerPromptRef}
						className="viewerPrompt"
						role="dialog"
						aria-modal="true"
						aria-labelledby="viewer-prompt-title"
						onKeyDown={handleViewerPromptKeyDown}
					>
						<div className="viewerPromptContent">
							<button className="viewerPromptClose" type="button" onClick={() => setShowViewerPrompt(false)} aria-label="Close dialog">
								×
							</button>
							<h2 id="viewer-prompt-title">View interactions live</h2>
							<p>Open the Interaction Viewer in a new tab before selecting and submitting an interaction.</p>
							<a href="/interaction-viewer" target="_blank" rel="noreferrer" onClick={() => setShowViewerPrompt(false)}>
								Open Interaction Viewer
							</a>
						</div>
					</div>
				)}
				<InteractiveLibraryHeader handleSubmit={handleSubmit} submitDisabled={!selectedInteractionId} />
				<h1 className="interactionLibraryTitle">Select an interaction</h1>

				<div className="interactionLibraryContent">
					{interactionData.map((interaction) => (
						<InteractionElement key={interaction.id} title={interaction.title} description={interaction.description} id={interaction.id} />
					))}
				</div>
				{submissionToast && (
					<div className={`submissionToast submissionToast--${submissionToast.variant}`} role="status">
						{submissionToast.message}
					</div>
				)}
			</div>
		</main>
	);
};

export default InteractionLibrary;

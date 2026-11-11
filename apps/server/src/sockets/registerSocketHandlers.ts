import type { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData } from "@creative/shared";
import type { Server } from "socket.io";

type CreativeServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

const SUBMISSION_LIMIT = 5;
const SUBMISSION_WINDOW_MS = 60 * 1000;

export function registerSocketHandlers(io: CreativeServer) {
	io.on("connection", (socket) => {
		const submissionTimestamps: number[] = [];
		const connectedAt = new Date().toISOString();
		socket.data.connectedAt = connectedAt;
		socket.emit("connection:ready", {
			socketId: socket.id,
			connectedAt,
		});

		socket.on("creative:ping", (payload) => {
			const now = Date.now();
			const oldestAllowedTimestamp = now - SUBMISSION_WINDOW_MS;
			while (submissionTimestamps[0] <= oldestAllowedTimestamp) {
				submissionTimestamps.shift();
			}

			if (submissionTimestamps.length >= SUBMISSION_LIMIT) {
				const retryAfterMs = submissionTimestamps[0] + SUBMISSION_WINDOW_MS - now;
				socket.emit("interaction:rejected", {
					message: "You can submit up to 5 interactions per minute.",
					retryAfterMs,
				});
				return;
			}

			submissionTimestamps.push(now);
			io.emit("interaction:created", payload);
		});

		socket.on("disconnect", (reason) => {
			console.info(`Socket ${socket.id} disconnected: ${reason}`);
		});
	});
}

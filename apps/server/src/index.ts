import "dotenv/config";
import { createServer } from "node:http";
import cors from "cors";
import express from "express";
import {
  type ClientToServerEvents,
  type InterServerEvents,
  type ServerToClientEvents,
  type SocketData,
} from "@creative/shared";
import { Server } from "socket.io";
import { healthRouter } from "./routes/health.js";
import { registerSocketHandlers } from "./sockets/registerSocketHandlers.js";

const port = Number(process.env.PORT ?? 3001);
const clientOrigins = (process.env.CLIENT_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();
const httpServer = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: clientOrigins,
  },
});

app.use(cors({ origin: clientOrigins }));
app.use(express.json());
app.use("/api/health", healthRouter);

registerSocketHandlers(io);

httpServer.listen(port, () => {
  console.info(`Server listening on http://localhost:${port}`);
});

let isShuttingDown = false;

function shutdown(signal: NodeJS.Signals) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.info(`Received ${signal}; closing server.`);
  io.close();
  httpServer.close((error) => {
    if (error) {
      console.error("Server shutdown failed.", error);
      process.exitCode = 1;
    }
  });
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

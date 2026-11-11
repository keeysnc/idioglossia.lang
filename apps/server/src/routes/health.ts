import { Router } from "express";
import type { HealthResponse } from "@creative/shared";

export const healthRouter = Router();

healthRouter.get("/", (_request, response) => {
  const payload: HealthResponse = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };

  response.json(payload);
});

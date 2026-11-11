import { Router } from "express";
export const healthRouter = Router();
healthRouter.get("/", (_request, response) => {
    const payload = {
        status: "ok",
        timestamp: new Date().toISOString(),
    };
    response.json(payload);
});

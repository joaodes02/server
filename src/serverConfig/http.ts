import http from "http";
import { app } from "./appExpress";

const httpServer = http.createServer(app);

export { httpServer };

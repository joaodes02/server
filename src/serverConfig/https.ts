import https from "https";
import { app } from "./appExpress";
import fs from "fs";

const httpsServer = https.createServer(
  {
    key: fs.readFileSync("private.key"),
    cert: fs.readFileSync("certificate.crt"),
  },
  app
);

export { httpsServer };

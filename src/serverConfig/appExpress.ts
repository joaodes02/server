import express from "express";
import { auth } from "../routes/auth";
import { operacao } from "../routes/operacao";

const cors = require("cors");
const app = express();
const httpsPort = 3344;
const httpPort = 3322;
app.use(express.json());

app.use(cors());

app.use(auth);
app.use(operacao);

export { app, httpsPort, httpPort, express };

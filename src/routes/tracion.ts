import { express } from "../serverConfig/appExpress";
import { prisma } from "../database/prisma";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

const tracion = express.Router();

import { express } from "../serverConfig/appExpress";
import { prisma } from "../database/prisma";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

const tracion = express.Router();

//endpoint para executar o VACCUM no banco de dados
tracion.get("/vacuum", async (req: Request, res: Response) => {
  try {
    await prisma.$executeRaw`VACUUM`;
    res.json({ message: "VACUUM executado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao executar o VACUUM." });
  }
});

//endpoint para buscar todos os tracionamentos
tracion.get("/", async (req: Request, res: Response) => {
  try {
    const tracions = await prisma.tracion.findMany();
    res.json(tracions);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os tracionamentos." });
  }
});

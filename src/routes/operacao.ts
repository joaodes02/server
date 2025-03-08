import { express } from "../serverConfig/appExpress";
import { prisma } from "../database/prisma";
import { Request, Response } from "express";
import { Prisma } from "@prisma/client";

const operacao = express.Router();

// Endpoint para executar VACUUM
operacao.post("/operacao/vacuum", async (req: Request, res: Response) => {
  try {
    // Lista de tabelas a serem truncadas
    const tabelas = ["Operacao", "Dados", "Nominal", "Rev", "Dureza", "Oil"];

    // Desativa restrições de chave estrangeira temporariamente
    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF;`);

    // Limpa cada tabela e reseta o autoincrement
    for (const tabela of tabelas) {
      await prisma.$executeRawUnsafe(`DELETE FROM ${tabela};`); // Deleta os dados
      await prisma.$executeRawUnsafe(
        `DELETE FROM sqlite_sequence WHERE name='${tabela}';`
      ); // Reseta autoincrement
    }

    // Reativa as chaves estrangeiras
    await prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);

    res.json({
      message: "Todas as tabelas (exceto Usuarios) foram limpas e resetadas!",
    });
  } catch (error) {
    console.error("Erro ao resetar tabelas:", error);
    res.status(500).json({ error: "Erro ao resetar as tabelas" });
  }
});

// Endpoint para consultar todas as operações
operacao.get("/operacao/consultar", async (req: Request, res: Response) => {
  try {
    const Equipamento = req.query.equipamento as string;
    const Turno = req.query.turno as string;
    const Data =
      (req.query.data as string) || new Date().toISOString().split("T")[0];
    console.log(Data);

    const filtros: any = {};

    // 📌 Filtro por Equipamento na tabela "Dados"
    if (Equipamento) {
      filtros.dados = {
        is: {
          equipamento: Equipamento,
        },
      };
    }

    // 📌 Filtro por Data (TOC) - Convertendo corretamente para Date
    if (Data) {
      const dataInicio = new Date(
        new Date(Data).setUTCHours(0, 0, 0, 0)
      ).toISOString();
      const dataFim = new Date(
        new Date(Data).setUTCHours(23, 59, 59, 999)
      ).toISOString();

      filtros.toc = {
        gte: dataInicio, // >= Data 00:00:00
        lte: dataFim, // <= Data 23:59:59
      };
    }

    // 📌 Filtro por Turno
    if (Turno && Data) {
      const dataInicio = new Date(Data);
      const dataFim = new Date(Data);

      switch (Turno) {
        case "Turno - 1":
          dataInicio.setUTCHours(2, 0, 0, 0); // Horário em UTC
          dataFim.setUTCHours(9, 59, 59, 999); // Horário em UTC
          break;
        case "Turno - 2":
          dataInicio.setUTCHours(10, 0, 0, 0); // Horário em UTC
          dataFim.setUTCHours(17, 59, 59, 999); // Horário em UTC
          break;
        case "Turno - 3":
          dataFim.setDate(dataFim.getDate() + 1); //dia seguinte caio domingues!
          dataInicio.setUTCHours(18, 0, 0, 0); // Horário em UTC
          dataFim.setUTCHours(1, 59, 59, 999); // Horário em UTC
          break;
        default:
          return res.status(400).json({ error: "Turno inválido" });
      }

      filtros.toc = {
        gte: dataInicio.toISOString(),
        lte: dataFim.toISOString(),
      };

      const ano = dataInicio.getFullYear();
      const mes = String(dataInicio.getMonth() + 1).padStart(2, "0"); // Adiciona 1 porque o mês começa em 0
      const dia = String(dataInicio.getDate()).padStart(2, "0"); // Garante que o dia tenha 2 dígitos

      const dataFormatada = `${ano}-${mes}-${dia}`;
      const horaFormatada = dataInicio
        .toLocaleTimeString("pt-BR", { hour12: false })
        .padStart(8, "0"); // Formata a hora

      console.log(`${dataFormatada}T${horaFormatada}.999Z`);
    }

    // 📌 Consulta Prisma com filtros aplicados
    const operacoes = await prisma.operacao.findMany({
      where: filtros,
      include: {
        dados: true,
        nominal: true,
        rev: true,
        dureza: true,
        oil: true,
      },
    });

    console.log(filtros);
    res.json(operacoes);
  } catch (error) {
    console.error("Erro ao consultar operações:", error);
    res.status(500).json({ error: "Erro ao buscar operações" });
  }
});

// Endpoint para inserir uma nova operação
operacao.post("/operacao/insert", async (req: Request, res: Response) => {
  console.log(req.body);

  const { novoDado } = req.body;

  if (!novoDado) {
    return res.status(400).json({ error: "Dados nulos ou vazios" });
  }

  try {
    const resultado = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Criar a operação principal
        const operacao = await tx.operacao.create({ data: {} });

        // Criar registros nas tabelas filhas
        const dados = await tx.dados.create({
          data: {
            equipamento: novoDado.dados.equipamento,
            horario: novoDado.dados.horario,
            item: novoDado.dados.item,
            bobina: novoDado.dados.bobina,
            operacaoId: operacao.id,
          },
        });

        const nominal = await tx.nominal.create({
          data: {
            superior: parseFloat(novoDado.nominal.superior),
            inferior: parseFloat(novoDado.nominal.inferior),
            operacaoId: operacao.id,
          },
        });

        const rev = await tx.rev.create({
          data: {
            esqSup: parseFloat(novoDado.rev.esqSup),
            centroSup: parseFloat(novoDado.rev.centroSup),
            dirSup: parseFloat(novoDado.rev.dirSup),
            esqInf: parseFloat(novoDado.rev.esqInf),
            centroInf: parseFloat(novoDado.rev.centroInf),
            dirInf: parseFloat(novoDado.rev.dirInf),
            ligaSup: parseFloat(novoDado.rev.ligaSup),
            ligaInf: parseFloat(novoDado.rev.ligaInf),
            mediaSup: parseFloat(novoDado.rev.mediaSup),
            mediaInf: parseFloat(novoDado.rev.mediaInf),
            dispSup: parseFloat(novoDado.rev.dispSup),
            dispInf: parseFloat(novoDado.rev.dispInf),
            operacaoId: operacao.id,
          },
        });

        const dureza = await tx.dureza.create({
          data: {
            esq: parseInt(novoDado.dureza.esq),
            centro: parseInt(novoDado.dureza.centro),
            dir: parseInt(novoDado.dureza.dir),
            operacaoId: operacao.id,
          },
        });

        const oil = await tx.oil.create({
          data: {
            esqSup: parseFloat(novoDado.oil.esqSup),
            centroSup: parseFloat(novoDado.oil.centroSup),
            dirSup: parseFloat(novoDado.oil.dirSup),
            mediaSup: parseFloat(novoDado.oil.mediaSup),
            esqInf: parseFloat(novoDado.oil.esqInf),
            centroInf: parseFloat(novoDado.oil.centroInf),
            dirInf: parseFloat(novoDado.oil.dirInf),
            mediaInf: parseFloat(novoDado.oil.mediaInf),
            operacaoId: operacao.id,
          },
        });

        // Atualizar a operação com os IDs das tabelas filhas
        return tx.operacao.update({
          where: { id: operacao.id },
          data: {
            dadosId: dados.id,
            durezaId: dureza.id,
            nominalId: nominal.id,
            oilId: oil.id,
            revId: rev.id,
          },
        });
      }
    );

    res.status(201).json({
      message: "Operação e dados inseridos com sucesso",
      operacao: resultado,
    });
  } catch (e: any) {
    console.error("Erro ao inserir operação:", e);
    res
      .status(500)
      .json({ error: "Erro ao inserir operação", details: e.message });
  }
});

// Endpoint para deletar uma operação por ID
operacao.delete("/operacao/delete/:id", async (req: Request, res: Response) => {
  const operacaoId = parseInt(req.params.id);

  if (isNaN(operacaoId)) {
    return res.status(400).json({ error: "ID inválido." });
  }

  try {
    const resultado = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const operacaoDeletada = await tx.operacao.delete({
          where: { id: operacaoId },
        });
        const operacaoRev = await tx.rev.delete({
          where: { operacaoId: operacaoId },
        });
        const operacaoDados = await tx.dados.delete({
          where: { operacaoId: operacaoId },
        });
        const operacaoDureza = await tx.dureza.delete({
          where: { operacaoId: operacaoId },
        });
        const operacaoNominal = await tx.nominal.delete({
          where: { operacaoId: operacaoId },
        });
        const operacaoOil = await tx.oil.delete({
          where: { operacaoId: operacaoId },
        });
      }
    );
    return res.json({ message: "Operação deletada com sucesso!", resultado });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erro ao deletar operação.", detalhes: error });
  }
});

operacao.patch("/operacao/edit/:id", async (req: Request, res: Response) => {
  const operacaoId = parseInt(req.params.id);
  const novosDados = req.body;

  if (isNaN(operacaoId)) {
    return res.status(400).json({ error: "ID inválido!" });
  }

  try {
    const resultado = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const operacaoEditada = await tx.operacao.update({
          where: { id: operacaoId },
          data: {
            tom: novosDados.tom,
            dados: {
              update: {
                equipamento: novosDados.dados.equipamento,
                horario: novosDados.dados.horario,
                item: novosDados.dados.item,
                bobina: novosDados.dados.bobina,
              },
            },
            nominal: {
              update: {
                superior: parseFloat(novosDados.nominal.superior),
                inferior: parseFloat(novosDados.nominal.inferior),
              },
            },
            rev: {
              update: {
                esqSup: parseFloat(novosDados.rev.esqSup),
                centroSup: parseFloat(novosDados.rev.centroSup),
                dirSup: parseFloat(novosDados.rev.dirSup),
                esqInf: parseFloat(novosDados.rev.esqInf),
                centroInf: parseFloat(novosDados.rev.centroInf),
                dirInf: parseFloat(novosDados.rev.dirInf),
                ligaSup: parseFloat(novosDados.rev.ligaSup),
                ligaInf: parseFloat(novosDados.rev.ligaInf),
                mediaSup: parseFloat(novosDados.rev.mediaSup),
                mediaInf: parseFloat(novosDados.rev.mediaInf),
                dispSup: parseFloat(novosDados.rev.dispSup),
                dispInf: parseFloat(novosDados.rev.dispInf),
              },
            },
            dureza: {
              update: {
                esq: novosDados.dureza.esq,
                centro: novosDados.dureza.centro,
                dir: novosDados.dureza.dir,
              },
            },
            oil: {
              update: {
                esqSup: parseFloat(novosDados.oil.esqSup),
                centroSup: parseFloat(novosDados.oil.centroSup),
                dirSup: parseFloat(novosDados.oil.dirSup),
                mediaSup: parseFloat(novosDados.oil.mediaSup),
                esqInf: parseFloat(novosDados.oil.esqInf),
                centroInf: parseFloat(novosDados.oil.centroInf),
                dirInf: parseFloat(novosDados.oil.dirInf),
                mediaInf: parseFloat(novosDados.oil.mediaInf),
              },
            },
          },
        });

        const operacaoRev = await tx.rev.updateMany({
          where: { operacaoId: operacaoId }, // Certifique-se de que `operacaoId` seja um número
          data: {
            esqSup: parseFloat(novosDados.rev.esqSup),
            centroSup: parseFloat(novosDados.rev.centroSup),
            dirSup: parseFloat(novosDados.rev.dirSup),
            esqInf: parseFloat(novosDados.rev.esqInf),
            centroInf: parseFloat(novosDados.rev.centroInf),
            dirInf: parseFloat(novosDados.rev.dirInf),
            ligaSup: parseFloat(novosDados.rev.ligaSup),
            ligaInf: parseFloat(novosDados.rev.ligaInf),
            mediaSup: parseFloat(novosDados.rev.mediaSup),
            mediaInf: parseFloat(novosDados.rev.mediaInf),
            dispSup: parseFloat(novosDados.rev.dispSup),
            dispInf: parseFloat(novosDados.rev.dispInf),
            operacaoId: operacaoId, // Garante que `operacaoId` seja um número inteiro
          },
        });

        const operacaoDados = await tx.dados.updateMany({
          where: { operacaoId: operacaoId },
          data: novosDados.dados,
        });

        const operacaoDureza = await tx.dureza.updateMany({
          where: { operacaoId: operacaoId },
          data: novosDados.dureza,
        });

        const operacaoNominal = await tx.nominal.updateMany({
          where: { operacaoId: operacaoId },
          data: {
            superior: parseFloat(novosDados.nominal.superior),
            inferior: parseFloat(novosDados.nominal.inferior),
          },
        });

        const operacaoOil = await tx.oil.updateMany({
          where: { operacaoId: operacaoId },
          data: {
            esqSup: parseFloat(novosDados.oil.esqSup),
            centroSup: parseFloat(novosDados.oil.centroSup),
            dirSup: parseFloat(novosDados.oil.dirSup),
            esqInf: parseFloat(novosDados.oil.esqInf),
            centroInf: parseFloat(novosDados.oil.centroInf),
            dirInf: parseFloat(novosDados.oil.dirInf),
            mediaSup: parseFloat(novosDados.oil.mediaSup),
            mediaInf: parseFloat(novosDados.oil.mediaInf),
            operacaoId: operacaoId, // Garante que `operacaoId` seja um número inteiro
          },
        });

        return {
          operacaoEditada,
          operacaoRev,
          operacaoDados,
          operacaoDureza,
          operacaoNominal,
          operacaoOil,
        };
      }
    );
    res.json({ message: "Operação editar com sucesso!", resultado });
  } catch (error) {
    console.error("Erro ao editar:", error);
    return res.status(500).json({ "Erro ao editar": error });
  }
});

export { operacao };

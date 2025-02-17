import { express } from "../serverConfig/appExpress";
import { autenticarUsuarioAD } from "../controller/adController";
import { prisma } from "../database/prisma";

const jwt = require("jsonwebtoken");
const auth = express.Router();

auth.post("/login", async (req, res) => {
  const { matricula, senha } = req.body;

  if (!matricula || !senha) {
    return res.status(400).json({ error: "Matricula e senha são necessários" });
  }

  try {
    // vericar se o usuario existe no AD(CSN) com a senha fornecida

    // const usuarioNoAD = await autenticarUsuarioAD(matricula, senha);

    // if (!usuarioNoAD) {
    //   return res.status(400).json({
    //     error: "Usuário não encontrado no AD ou credenciais incorretas.",
    //   });
    // }

    const usuario = await prisma.usuarios.findFirst({
      where: {
        Matricula: matricula.toUpperCase(),
      },
    });
    console.log(usuario);
    if (usuario && usuario.ativo) {
      const token = jwt.sign({ matricula: usuario.Matricula }, "secreta", {
        expiresIn: "8h", //define o tempo do token
      });
      console.log(token);

      return res.status(200).json({ message: "Login bem-sucedido", token });
    }
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado! " });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao autenticar o usuário no AD" });
  }
});

export { auth };

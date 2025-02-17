import { httpPort, httpsPort } from "./serverConfig/appExpress";
import { httpsServer } from "./serverConfig/https";
import { httpServer } from "./serverConfig/http";

httpServer.listen(httpPort);
// httpsServer.listen(httpsPort)

console.log("servidor rodando na porta:", httpPort);
// console.log("servidor rodando na porta:", httpsPort);

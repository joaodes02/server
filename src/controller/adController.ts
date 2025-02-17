import ldap from "ldapjs";

const ldapUrl = "ldap:172.16.9.17"; // servidor LDAP
const baseDN = "DC=corp,DC=csn,DC=com,DC=br"; // Base DN
const domainPrefix = "MASTER"; // Prefixo do domínio

interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  department: string;
  passwordExpirationDate: Date;
}
// Função para autenticar no Active Directory e buscar informações

async function autenticarUsuarioAD(
  user: string,
  password: string
): Promise<AuthenticatedUser | null> {
  const client = ldap.createClient({ url: ldapUrl });

  return new Promise((resolve, reject) => {
    const userDN = `${domainPrefix}\\${user}`; //formato esperado pelo ad

    client.bind(userDN, password, async (err) => {
      if (err) {
        console.error("❌ Falha na autenticação LDAP:", err);
        reject(null);
        return;
      }
      console.log("✅ Usuário autenticado no LDAP!");

      const searchOptions: ldap.SearchOptions = {
        filter: `(sAMAccountName=${user})`, // Filtra pelo nome de usuário
        scope: "sub", // Garante que o valor seja um dos aceitos
        attributes: ["displayName", "mail", "info", "pwdLastSet", "maxPwdAge"], // Lista os atributos desejados
      };

      client.search(baseDN, searchOptions, (searchErr: any, res: any) => {
        if (searchErr) {
          console.error("❌ Erro na busca LDAP:", searchErr);
          reject(null);
          return;
        }

        let userData: AuthenticatedUser | null = null;

        res.on("searchEntry", (entry: any) => {
          const displayName = entry.displayName || "";
          const mail = entry.mail || "";
          const info = entry.info || "";
          const pwdLastSet = entry.pwdLastSet
            ? new Date(parseInt(entry.object.pwdLastSet))
            : new Date(0);
          const maxPwdAge = entry.maxPwdAge
            ? parseInt(entry.object.maxPwdAge)
            : 0;
          const passwordExpirationDate = new Date(
            pwdLastSet.getTime() + maxPwdAge * -1000 * 86400
          );

          userData = {
            id: user,
            name: displayName,
            email: mail,
            department: info.split("\n").pop() || "",
            passwordExpirationDate,
          };
        });

        res.on("end", () => {
          if (userData) {
            console.log("✅ Usuário encontrado no LDAP:");
            resolve(userData);
          } else {
            console.error("❌ Usuário não encontrado no LDAP.");
            reject(null);
          }
        });

        res.on("error", (error: any) => {
          console.error("⚠️ Erro na resposta LDAP:", error.message);
          reject(null);
        });
      });
    });
  });
}

export { autenticarUsuarioAD };

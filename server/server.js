import { config } from "./../config/config.js";
import app from "./express";
import { sequelize } from "./bdatos/bdatos.js";

async function main() {
  try {
    await sequelize.authenticate();
    console.log("Conectado a Mysql");
  } catch (error) {
    console.error("Error en SQL :", error);
  }

  try {
    // Iniciando servidor de express
    app.listen(config.nodeport);
    console.log("Servidor Iniciado en puerto :", config.nodeport);
  } catch (e) {
    console.log(
      " *************  No pude Iniciar Servidor express en puerto=>>>",
      config.nodeport,
      " Con error :",
      e
    );
  }
}

main();

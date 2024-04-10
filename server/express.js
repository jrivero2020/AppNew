import * as React from "react";
import express from "express";
import cookieParser from "cookie-parser";
import compress from "compression";
import cors from "cors";
import helmet from "helmet";

import usuariosRutas from "./rutas/usuario.rutas.js";
import docenteRutas from "./rutas/docente.rutas.js";
import autorizadoRutas from "./rutas/autorizado.rutas.js";

import Template from "./../template";
import path from "path";

// modules for server side rendering

import ReactDOMServer from "react-dom/server";
import MainRouter from "./../client/MainRouter";
import { StaticRouter } from "react-router-dom/server";
import { ServerStyleSheets } from "@mui/styles";
import { ThemeProvider } from "@mui/material/styles";
import "./../client/assets/css/StyleMainPageImg.css";

// fin nuevo de Material

import theme from "./../client/theme";

import "./../client/assets/css/navbar.css";
// Para desarrollo
import devBundle from "./devBundle.js";
// import "./../client/assets/css/myStyle.css";
// end

const CURRENT_WORKING_DIR = process.cwd();

const app = express();

// Para desarrollo
devBundle.compile(app);
// Comentar para produccion

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());
app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "/dist")));

app.use("/", usuariosRutas);
app.use("/", docenteRutas);
app.use("/", autorizadoRutas);

app.get("*", (req, res) => {
  const sheets = new ServerStyleSheets();
  const context = {};
  const markup = ReactDOMServer.renderToString(
    sheets.collect(
      <StaticRouter location={req.url} context={context}>
        <ThemeProvider theme={theme}>
          <MainRouter />
        </ThemeProvider>
      </StaticRouter>
    )
  );
  if (context.url) {
    return res.redirect(303, context.url);
  }
  const css = sheets.toString();
  res.status(200).send(
    Template({
      markup: markup,
      css: css,
    })
  );
});

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

export default app;

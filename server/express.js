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

// Nuevo de material
//import { CssBaseline } from '@mui/material/CssBaseline'
import CssBaseline from "@mui/material/CssBaseline";
import { ServerStyleSheets, ThemeProvider } from "@mui/styles";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "./createEmotionCache.js";
import "./../client/assets/css/StyleMainPageImg.css";
// fin nuevo de Material

import Menu from "./../client/core/menujr";
import theme from "./../client/theme";

import "./../client/assets/css/navbar.css";
// end

const CURRENT_WORKING_DIR = process.cwd();

const app = express();

// Para desarrollo
import devBundle from "./devBundle.js";
devBundle.compile(app);
// Comentar para produccion

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());
app.use("/dist", express.static(path.join(CURRENT_WORKING_DIR, "/dist")));

app.use(usuariosRutas);
app.use(docenteRutas);
app.use(autorizadoRutas);

app.get("*", (req, res) => {
  const context = {};
  const cache = createEmotionCache();
  const { extractCriticalToChunks, constructStyleTagsFromChunks } =
    createEmotionServer(cache);
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <CacheProvider value={cache}>
        <Menu />
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <MainRouter />
        </ThemeProvider>
        <CssBaseline />
      </CacheProvider>
    </StaticRouter>
  );

  // Grab the CSS from emotion
  const emotionChunks = extractCriticalToChunks(html);
  const emotionCss = constructStyleTagsFromChunks(emotionChunks);

  //app.get('/', (req, res) => {
  if (context.url) {
    return res.redirect(303, context.url);
  }

  res.status(200).send(
    Template({
      css: emotionCss,
      markup: html,
    })
  );
  //})
  // Send the rendered page back to the client.
  //res.send(renderFullPage(html, emotionCss));
});
// *****************************************************************

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ error: err.name + ": " + err.message });
  } else if (err) {
    res.status(400).json({ error: err.name + ": " + err.message });
    console.log(err);
  }
});

export default app;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CsvDownloadButton from "react-json-to-csv";
import { Typography, CardActions, Button, Grid } from "@mui/material";
import { getcsvLibroMatriculas } from "./../docentes/api-docentes";
import Item from "../core/Item";

export default function CsvLibroMatricula() {
  const [csvData, setCsvData] = useState(null);
  const [DataCargada, setDataCargada] = useState(false);

  const clickSubmit = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const signal = abortController.signal;
    getcsvLibroMatriculas(signal).then((data) => {
      if (data && data.error) {
        console.log("**ERROR** Datos CsvLibro:", data.error);
      } else {
        setCsvData(Object.values(data[0]));
        setDataCargada(true);
        console.log("Se ha generado el CSV", Object.values(data[0]));
      }
    });
  };

  const GenerarCsv = () => {
    console.log("entré  a GenerarCSV y la data es : ", csvData);
    let mackData = [
      { nombre: "nombre1", edad: 22, direccion: "los patos cua-cua1" },
      { nombre: "nombre2", edad: 23, direccion: "los patos cua-cua2" },
      { nombre: "nombre3", edad: 24, direccion: "los patos cua-cua3" },
      { nombre: "nombre4", edad: 25, direccion: "los patos cua-cua4" },
    ];

    return;
  };

  let mackData = [
    { nombre: "nombre1", edad: 22, direccion: "los patos cua-cua1" },
    { nombre: "nombre2", edad: 23, direccion: "los patos cua-cua2" },
    { nombre: "nombre3", edad: 24, direccion: "los patos cua-cua3" },
    { nombre: "nombre4", edad: 25, direccion: "los patos cua-cua4" },
  ];
  const navigate = useNavigate();

  return (
    <>
      <Grid
        container
        rowSpacing={1}
        sx={{
          paddingTop: "100px",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          maxWidth: "65%",
        }}
      >
        <Grid item xs={12}>
          <Item>
            <Typography variant="h5" gutterBottom sx={{ color: "blue" }}>
              Obtener data Libro Matrícula
            </Typography>
          </Item>
          <br />
        </Grid>

        <Grid item xs={6} sx={{ justifyContent: "center" }}>
          <CardActions>
            <Button color="primary" variant="contained" onClick={clickSubmit}>
              Ejecutar
            </Button>
          </CardActions>
        </Grid>
        {DataCargada && (
          <Grid item xs={6} sx={{ justifyContent: "center" }}>
            <CardActions>
              <CsvDownloadButton data={csvData} filename="csvLibro.csv" />
            </CardActions>
          </Grid>
        )}
      </Grid>
    </>
  );
}

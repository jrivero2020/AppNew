import React, { useState, useContext } from "react";
import CsvDownloadButton from "react-json-to-csv";
import { Typography, CardActions, Button, Grid } from "@mui/material";
import { getcsvLibroMatriculas } from "../docentes/api-docentes";
import Item from "../core/Item";
import { AuthContext } from "../core/AuthProvider";
import auth from "./../auth/auth-helper";

export default function CompLibroMatricula() {
  const [csvData, setCsvData] = useState(null);
  const [DataCargada, setDataCargada] = useState(false);
  const { isAuthenticated } = useContext(AuthContext);

  const clickSubmit = (event) => {
    if (isAuthenticated) {
      event.preventDefault();
      const abortController = new AbortController();
      const signal = abortController.signal;
      const jwt = auth.isAuthenticated();

      getcsvLibroMatriculas({ t: jwt.token }, signal).then((data) => {
        if (data && data.error) {
          console.log("**ERROR** Datos CsvLibro:", data.error);
        } else {
          setCsvData(Object.values(data[0]));
          setDataCargada(true);
        }
      });
    }
  };

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

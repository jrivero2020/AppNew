import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";

import { Button, Grid, Paper, Typography } from "@mui/material";
import BackspaceIcon from "@mui/icons-material/Backspace";
import { useState } from "react";

export default function ManejaModalGridNombre({
  AlumnosNombres,
  OffShowGrid,
  ModalOffBtnOn,
  setRutlAlpadre,
}) {
  const handleCellClick = (row, column) => {
    //setValores({
    //    ...valores,
    //    al_rut: row.row.al_rut,
    //    al_dv: row.row.al_dv
    //});
    setRutlAlpadre(row.row.al_rut + row.row.al_dv);
    OffShowGrid();
  };

  const GridCancela = () => {
    OffShowGrid();
    ModalOffBtnOn();
  };

  return (
    <Grid
      container
      sx={{
        alignItems: "center",
        justifyContent: "center",
        margin: "auto",
        maxWidth: "90%",
      }}
    >
      <Grid item xs={12}>
        <Paper
          elevation={4}
          sx={{
            padding: "1rem",
            border: "1px solid black",
            backgroundColor: "lightgrey",
          }}
        >
          <Typography
            style={{ fontSize: "13px" }}
            variant="h6"
            gutterBottom
            sx={{ color: "blue", textAlign: "center" }}
          >
            Haga doble click en la fila a seleccionar
          </Typography>
          <Button
            variant="contained"
            size="small"
            style={{ fontSize: "9px" }}
            startIcon={<BackspaceIcon />}
            onClick={GridCancela}
          >
            Cancela
          </Button>

          <Grid
            item
            xs={12}
            sx={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DataGrid
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              rowHeight={25}
              rows={Object.values(AlumnosNombres)}
              columns={columns}
              onCellDoubleClick={handleCellClick}
            />
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}

const columns = [
  {
    field: "al_rut",
    headerName: "Rut",
    width: 85,
    height: 25,
    editable: false,
  },
  {
    field: "al_dv",
    headerName: "dv",
    width: 1,
    height: 25,
    editable: false,
  },
  {
    field: "al_nombres",
    headerName: "Nombres",
    width: 220,
    height: 25,
    editable: false,
  },
  {
    field: "al_apat",
    headerName: "Ap. Paterno",
    width: 180,
    height: 25,
    editable: false,
  },
  {
    field: "al_amat",
    headerName: "Ap. Materno",
    width: 180,
    height: 25,
    editable: false,
  },
  {
    field: "curso",
    headerName: "Curso",
    width: 270,
    height: 25,
    editable: false,
  },
];

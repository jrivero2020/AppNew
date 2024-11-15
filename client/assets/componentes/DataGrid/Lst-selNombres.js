import React from "react";
import { esES } from "@mui/x-data-grid/locales";
import { DataGrid } from "@mui/x-data-grid";

import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BackspaceIcon from "@mui/icons-material/Backspace";

import {
    Grid,
    Paper,
    Typography,
    Button,
  } from "@mui/material";
  

import { ColBuscaAlumnos } from "./../../data/columnasGrid/ColBuscaAlumnos"


export const ListaNombresGrilla = ({ alumnosGetApi, resultado, setResultado }) => {
    const columns = [
      ...ColBuscaAlumnos,
      {
        field: "seleccionar",
        headerName: "Seleccionar",
        width: 140,
        sortable: false,
        renderCell: (params) => (
          <PersonSearchIcon
            style={{ cursor: "pointer", color: "green" }}
            onClick={() => handleSelect(params.row.al_rut)}
          />
        ),
      },
    ];

    const handleSelect = (rut) => {
      setResultado({ ...resultado, fRut: rut, result: 2 });
    };
    const handleCellClick = (row, column) => {
      const rut = row.row.al_rut;
      setResultado({ ...resultado, fRut: rut, result: 2 });
    };

    const GridCancela = () => {
      setResultado({ ...resultado, fRut: 0, result: 0 });
    };

    return (
      <div style={{ paddingTop: "99px" }}>
        <Grid
          container
          sx={{
            alignItems: "center",
            justifyContent: "center",
            margin: "auto",
            maxWidth: "55%",
          }}
        >
          <Grid item xs={12}>
            <Paper
              elevation={10}
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
                  localeText={
                    esES.components.MuiDataGrid.defaultProps.localeText
                  }
                  rowHeight={25}
                  rows={Object.values(alumnosGetApi)}
                  columns={columns}
                  onCellDoubleClick={handleCellClick}
                  sx={{
                    backgroundColor: "lightgrey", // Fondo para el cuerpo del DataGrid
                    "& .MuiDataGrid-columnHeaderTitleContainer": {
                      backgroundColor: "lightgrey", // Fondo para los encabezados de columna
                    },
                    "& .MuiDataGrid-columnHeader--sortable": {
                      backgroundColor: "lightgrey", // Fondo para el espacio de clasificación en los encabezados
                    },
                    "& .MuiDataGrid-columnHeader--last": {
                      backgroundColor: "lightgrey", // Fondo para el espacio de clasificación en los encabezados agregados
                    },

                  }}
                />
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
}
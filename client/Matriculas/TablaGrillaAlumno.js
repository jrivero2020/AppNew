import * as React from "react";
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { api_getAlumnosNombres } from "./../docentes/api-docentes";
import { esES as esESCore } from "@mui/material/locale";
import { Button } from "@mui/material";

function BasicEditingGrid(props) {
  const { datosal, dRut, manejaSetdRut, PanelBusca, setPanelBusca } = props;

  const abortController = new AbortController();
  const signal = abortController.signal;

  const [AlumnosNombres, setAlumnosNombres] = useState({});
  const [ShowPanel, setShowPanel] = useState(false);

  const handleCellClick = (row, column) => {
    const nuevodRut = { ...dRut };
    nuevodRut.rut = row.row.al_rut;
    nuevodRut.dv = row.row.al_dv;
    nuevodRut.visitado = true;
    manejaSetdRut(nuevodRut);
  };

  // console.log("datosal en BasicEditingGrid ", datosal)
  React.useEffect(() => {
    api_getAlumnosNombres(datosal, signal).then((data) => {
      if (data && data.error) {
        console.log("*** Error ***", data.error);
      } else {
        const [results, metadata] = data;
        if (
          results[0] === undefined ||
          results[0] === null ||
          Object.keys(results[0]).length === 0
        ) {
          alert(
            "**ATENCION** Datos no encontrados en las Matrículas del establecimiento"
          );
        } else {
          setAlumnosNombres(results);
          setShowPanel(true);
        }
      }
    });
  }, []);

  return (
    ShowPanel && (
      <>
        //{" "}
        {console.log("len data alumnos: ", Object.keys(AlumnosNombres).length)}
        <div>Presione doble click para seleccionar</div>
        <DataGrid
          rowHeight={25}
          localeText={esESCore}
          rows={Object.values(AlumnosNombres)}
          columns={columns}
          onCellDoubleClick={handleCellClick}
        />
      </>
    )
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
    width: 170,
    height: 25,
    editable: false,
  },
  {
    field: "al_apat",
    headerName: "Ap. Paterno",
    width: 160,
    height: 25,
    editable: false,
  },
  {
    field: "al_amat",
    headerName: "Ap. Materno",
    width: 160,
    height: 25,
    editable: false,
  },
  {
    field: "curso",
    headerName: "Curso",
    width: 200,
    height: 25,
    editable: false,
  },
];

export default BasicEditingGrid;

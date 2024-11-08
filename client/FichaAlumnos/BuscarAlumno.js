import React, { useContext, useEffect, useState } from "react";
import {
  Grid,
  createTheme,
  ThemeProvider,
  Alert,
  AlertTitle,
  Snackbar,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

import { AuthContext } from "../core/AuthProvider";
import BackspaceIcon from "@mui/icons-material/Backspace";
// import { cFichaAlumno } from "./../Matriculas/matriculasCampos"

import {
  CustomGridTitulo,
  PaperBuscaAlumno,
} from "./../assets/componentes/customGridPaper/customVerAlumnos";

import {
  fNuevoAlumno,
  BuscaRut,
  BuscaNombre,
  GetApiData
} from "./../assets/GrillaExamples/GridBuscarFichaAlumnos";

import { esES }     from '@mui/x-data-grid/locales';
import { DataGrid } from "@mui/x-data-grid";


const theme = createTheme({
  palette: {
    secondary: {
      main: "#LightSeaGreen", // Cambia esto al color deseado
    },
  },
});

export default function BuscarAlumno() {
  const [snackbar, setSnackbar] = useState(null);
  const handleCloseSnackbar = () => setSnackbar(null);
  const [resultado, setResultado] = useState({
    fRut: "",
    result: 0,
    al_amat: "",
    al_apat: "",
    al_nombres: "",
  });

  const [alumnosGetApi, SetAlumnosGetApi] = useState([]);

  const gridBusca = [0, 3, 4]; // 0=init, 3=error,4=abort
  const alNuevo = 1;
  const rutOk = 2;
  const alAntiguo = 5;
  const buscarNombre = 6;
  const NombreNotFound = 7;
  const openGridAlumno = 8;
  
const MsgRut = 0;
const MsgNombre = 1;

  const rutMalo = 3;
  const { dataBuscaAl, setDataBuscaAl } = useContext(AuthContext);

  const MsgTitulo = ({ titulo }) => {
    return (
      <ThemeProvider theme={theme}>
        <div style={{ paddingTop: "99px" }}>
          <CustomGridTitulo
            titulo={titulo}
            color={"#FFFFFF"}
            backGround={"#1976d2"}
          />
        </div>
      </ThemeProvider>
    );
  };

  const MsgMuestraError = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open
        onClose={handleCloseSnackbar}
        autoHideDuration={3000}
        direction={"up"}
        slide={"up"}
      >
        <Alert {...snackbar} onClose={handleCloseSnackbar}>
          <AlertTitle>
            {snackbar.severity === "success" ? "Éxito" : "Error"}
          </AlertTitle>
          {snackbar.mensaje}
        </Alert>
      </Snackbar>
    );
  };
  const MsgError = ( ptrMsg) => {
    const arrMensaje = ["Rut ingresado no es válido", 
      "Nombre no existe en B.Datos"]; 

    setSnackbar({
      mensaje: arrMensaje[ptrMsg], // "Rut ingresado no es válido",
      severity: "error",
      variant: "filled",
    });
    setResultado({ ...resultado, fRut: "", result: 0 });
  };

  useEffect(() => {
    setDataBuscaAl({
      ...dataBuscaAl,
      al_rut: rutOk,
      al_dv: "",
      al_nombres: "",
      al_apat: "",
      al_amat: "",
      abort: true,
      nuevo: true,
      datagrid: false,
      buscando: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  
const alerta = ({alumnosGetApi}) => {
  console.log( "alumnosGetApi :", alumnosGetApi)
  
}




const ListaNombresGrilla = ({alumnosGetApi, resultado, setResultado}) => {
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
      width: 250,
      height: 25,
      editable: false,
    },
    {
      field: "al_apat",
      headerName: "Ap. Paterno",
      width: 140,
      height: 25,
      editable: false,
    },
    {
      field: "al_amat",
      headerName: "Ap. Materno",
      width: 140,
      height: 25,
      editable: false,
    },
    {
      field: "curso",
      headerName: "Curso",
      width: 65,
      height: 25,
      editable: false,
    },
    {
      field: 'seleccionar', // Nombre del campo
      headerName: 'Seleccionar',
      width: 140,
      sortable: false, // Evita que esta columna sea ordenable
      renderCell: (params) => (
        <PersonSearchIcon
          style={{ cursor: 'pointer', color: 'green' }}
          onClick={() => handleSelect(params.row.al_rut)} // Llama a la función con el RUT de la fila ( params.row.al_rut)
        />
      ),
    },

  ];
  
  const handleSelect=( rut )=>{
    setResultado({ ...resultado, fRut: rut, result: 2 });
  }
  const handleCellClick = (row, column) => {
    const rut = row.row.al_rut;  
    setResultado({ ...resultado, fRut: rut, result: 2 });
  };

  const GridCancela = () => {
    setResultado({ ...resultado, fRut: 0, result: 0 });

  };


return(
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
              localeText={esES.components.MuiDataGrid.defaultProps.localeText}
              rowHeight={25}
              rows={Object.values(alumnosGetApi)}
              columns={columns}
              onCellDoubleClick={handleCellClick}
              sx={{
                backgroundColor: 'lightgrey', // Fondo para el cuerpo del DataGrid
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: 'lightgrey', // Fondo para los encabezados de columna
                  },                
              }}
            />
          </Grid>
        </Paper>
      </Grid>
    </Grid>
    </div>
  )


  /*
  return (
          <>
        <div style={{marginTop: "68px"}}>Presione doble click para seleccionar</div>
        <DataGrid
          rowHeight={25}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          rows={Object.values(alumnosGetApi)}
          columns={columns}
          onCellDoubleClick={handleCellClick}
        />
      </>
    )
*/

  }



  return (
    <>
      {gridBusca.includes(resultado.result) && (
        <ThemeProvider theme={theme}>
          <div style={{ paddingTop: "99px" }}>
            <CustomGridTitulo
              titulo={"Busca alumno por ..."}
              color={"#FFFFFF"}
              backGround={"#1976d2"}
            />
            <Grid
              container
              spacing={2}
              sx={{ margin: "auto", maxWidth: "95%" }}
            >
              <PaperBuscaAlumno
                anchocol={3}
                titulo="Nuevo Alumno"
                BuscarX={fNuevoAlumno}
                resultado={resultado}
                setResultado={setResultado}
              />
              <PaperBuscaAlumno
                anchocol={3}
                titulo="Rut"
                BuscarX={BuscaRut}
                resultado={resultado}
                setResultado={setResultado}
              />
              <PaperBuscaAlumno
                anchocol={6}
                titulo="Nombre"
                BuscarX={BuscaNombre}
                resultado={resultado}
                setResultado={setResultado}
              />
            </Grid>
          </div>
        </ThemeProvider>
      )}
   
      {resultado.result === alAntiguo && (
        <MsgTitulo titulo={"Alumno antigüo, confirmar los datos"} />
      )}

      {resultado.result === buscarNombre && GetApiData({resultado, setResultado, alumnosGetApi, SetAlumnosGetApi})}
      {resultado.result === rutOk && <MsgTitulo titulo={"El rut está OK  " + resultado.fRut} />}      
      {resultado.result === NombreNotFound && MsgError(MsgNombre)}
      {resultado.result === rutMalo && MsgError(MsgRut)}

      {resultado.result === openGridAlumno && ListaNombresGrilla({alumnosGetApi, resultado, setResultado} ) }      

      {snackbar && <MsgMuestraError />}
    </>
  );
  
}

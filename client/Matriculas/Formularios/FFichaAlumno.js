import React, { useContext, useEffect, useState } from "react";
import {
  createTheme,
  Grid,
  ThemeProvider,
  Tabs,
  Tab,
  Button,
} from "@mui/material";

import { AuthContext } from "./../../core/AuthProvider";
import {
  getComunas,
  getParentesco,
  getCursos,
} from "./../../docentes/api-docentes";
import { CustomGridTitulo } from "./../../assets/componentes/customGridPaper/customVerAlumnos";
import { DatosAlumno } from "./DatosAlumno";
import { DatosApoderado } from "./DatosApoderado";
import { DatosFamiliares } from "./DatosFamiliares";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SaveIcon from "@mui/icons-material/Save";
import { MsgMuestraError } from "./../../assets/dialogs/MuestraError";
import { GrabarAlumno } from "./GrabaFichaAlumno";
import {
  cFichaAlumno,
  dataResultado,
} from "./../../Matriculas/matriculasCampos";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#LightSeaGreen", // Cambia esto al color deseado
    },
  },
});

export const FFichaAlumno = ({ resultado, setResultado }) => {
  const [value, setvalue] = useState(0);
  const { dataBuscaAl, setDataBuscaAl } = useContext(AuthContext);
  const { jwt } = useContext(AuthContext);
  const [comunas, setComunas] = useState([]);
  const [parentescos, setParentescos] = useState([]);
  const [cursos, setCursos] = useState(null);
  const [snackbar, setSnackbar] = useState(null);

  const alNuevo = 1;
  const handleChangeTabs = (event, newValue) => {
    setvalue(newValue);
  };

  const EsVacio = (valor) => {
    return valor === 0 || valor === "" || valor === null || valor === undefined;
  };

  const reseteoFichas = () => {
    setResultado(dataResultado);
    setDataBuscaAl(cFichaAlumno);
  };

  // ************************************************
  // Inicializa select y data alumnos
  useEffect(() => {
    //     if (!iniciado && resultado.result !== alNuevo && dataBuscaAl) {
    getComunas().then((data) => {
      if (data && data.error) {
        return false;
      } else {
        setComunas(data);
      }
    });

    getCursos().then((data) => {
      if (data && data.error) {
        return false;
      } else {
        const cursosArray = Object.values(data[0]);
        setCursos(cursosArray);
      }
    });

    getParentesco().then((data) => {
      if (data && data.error) {
        return false;
      } else {
        setParentescos(data);
      }
    });
  }, []);

  useEffect(() => {
    if (comunas && comunas.length > 0 && resultado.result !== alNuevo) {
      if (EsVacio(dataBuscaAl.al_id_comuna)) {
        setDataBuscaAl({ ...dataBuscaAl, al_id_comuna: 13102 });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comunas]);

  useEffect(() => {
    if ([1, 2, 3, 4].includes(resultado.swParentesco)) {
      actalizaPadres(resultado.swParentesco);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultado.swParentesco]); //


  if (!dataBuscaAl) {
    return <div>Cargando datos del alumno...</div>;
  }

  const actalizaPadres = (swValue) => {
    // Mapear el parentesco con los campos correspondientes
    const parentFields = {
      madre: ["madre_rut", "madre_dv", "madre_nombres", "madre_apat", "madre_amat"],
      padre: ["padre_rut", "padre_dv", "padre_nombres", "padre_apat", "padre_amat"],
    };
    const dataKey = (swValue >= 1 && swValue <= 2 ) ? "ap" : "apsu"
    const parentType = (swValue === 2 || swValue === 4 ) ? "madre" : "padre"
    console.log( "***actalizaPadres*** swValue=", swValue, "dataKey=", dataKey, " parentType=", parentType)
  
    if (parentType) {
      const [rut, dv, nombres, apat, amat] = parentFields[parentType];
  
     
      setDataBuscaAl({
        ...dataBuscaAl,
        [rut]: dataBuscaAl[`${dataKey}_rut`],
        [dv]: dataBuscaAl[`${dataKey}_dv`],
        [nombres]: dataBuscaAl[`${dataKey}_nombres`],
        [apat]: dataBuscaAl[`${dataKey}_apat`],
        [amat]: dataBuscaAl[`${dataKey}_amat`], // Asume que 'amat' es igual a 'apat'
      });

      setResultado( {...resultado, swParentesco: 0 })
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ paddingTop: "68px" }}>
        <CustomGridTitulo
          titulo={"FICHA INDIVIDUAL DEL ALUMNO"}
          color={"#FFFFFF"}
          backGround={"#1976d2"}
        />
      </div>
      <Grid container spacing={2} sx={{ margin: "auto", maxWidth: "95%" }}>
        <Grid item xs={12}>
          <Tabs
            value={value}
            onChange={handleChangeTabs}
            aria-label="Carpetas de datos"
            variant="scrollable" // Habilita el desplazamiento
            scrollButtons="auto" // Botones de desplazamiento automáticos
            TabIndicatorProps={{ sx: { display: "none" } }} // Oculta el indicador si se usa flexWrap
            sx={{
              ml: 8,
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": {
                textTransform: "none", // Mantén el texto como está
                fontWeight: "bold",
                borderTopLeftRadius: "8px", // Bordes para el efecto de carpeta
                borderTopRightRadius: "8px",
                border: "1px solid #ddd",
                borderBottom: "none",
                "&.Mui-selected": {
                  backgroundColor: "#1976d2",
                  color: "#fff",
                  borderBottom: "1px solid transparent",
                },
              },
              "& .MuiTabs-flexContainer": {
                flexWrap: "wrap", // Permite que los tabs se ajusten
              },
            }}
          >
            <Tab label="I.- Del Alumno" value={0} />
            <Tab label="II.- Del Apoderado" value={1} />
            <Tab label="III.- Familiares" value={2} />
          </Tabs>
        </Grid>
        {value === 0 && (
          <DatosAlumno
            resultado={resultado}
            setResultado={setResultado}
            cursos={cursos}
            comunas={comunas}
          />
        )}

        {value === 1 && (
          <DatosApoderado
            resultado={resultado}
            setResultado={setResultado}
            cursos={cursos}
            comunas={comunas}
            parentescos={parentescos}
          />
        )}
        {value === 2 && (
          <DatosFamiliares
            resultado={resultado}
            setResultado={setResultado}
            cursos={cursos}
            comunas={comunas}
            parentescos={parentescos}
          />
        )}
      </Grid>

      <Grid
        container
        spacing={2}
        sx={{
          margin: "auto",
          maxWidth: "95%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid item xs={12} sm={6} sx={{ textAlign: "center" }}>
          <Button
            size="large"
            variant="contained"
            sx={{ fontSize: "11px", mt: "10px" }}
            startIcon={<PersonAddIcon />}
            onClick={() => reseteoFichas()}
          >
            Nueva Búsqueda
          </Button>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ textAlign: "center" }}>
          <Button
            size="large"
            variant="contained"
            sx={{
              fontSize: "11px",
              mt: "10px",
              backgroundColor: "green", // Fondo verde

              "&:hover": {
                // Estilo al pasar el mouse
                backgroundColor: "darkgreen", // Fondo verde más oscuro al hover
              },
            }}
            startIcon={<SaveIcon />}
            onClick={() =>
              GrabarAlumno({
                resultado,
                setResultado,
                setSnackbar,
                dataBuscaAl,
                setDataBuscaAl,
                jwt,
              })
            }
          >
            Grabar Ficha del Alumno
          </Button>
        </Grid>
      </Grid>
      {snackbar && MsgMuestraError({ snackbar, setSnackbar })}

    </ThemeProvider>
  );
};

/*
DELIMITER $$

CREATE PROCEDURE InsertarActualizarAlumno(    
	IN prut INT, IN pdv CHAR(1), IN pnombres VARCHAR(50), IN papat VARCHAR(50), IN pamat VARCHAR(50),
    IN pfnac DATE, IN pgenero CHAR(1), IN pdomicilio VARCHAR(100), IN pidcomuna INT, IN pcurrepe TINYINT,
    IN pcanthnos INT, IN pnroentrehnos INT, IN phnosaca TINYINT, IN phnoscursos TINYINT, IN penfermo TINYINT,
    IN pcuidados VARCHAR(255), IN pprocedencia VARCHAR(100), IN ppromedionota DECIMAL(4, 2), 
    IN pidvivecon INT, IN pdescripcionvivecon VARCHAR(255), IN pidcurso INT, IN pactivo TINYINT, 
    IN pevaluareligion TINYINT, IN pap_rut INT, IN pap_dv CHAR(1), IN pap_nombres VARCHAR(50), 
    IN pap_apat VARCHAR(50), IN pap_amat VARCHAR(50), IN pap_parentesco VARCHAR(50), 
    IN pap_fono1 VARCHAR(15), IN pap_fono2 VARCHAR(15), IN pap_emergencia TINYINT, 
    IN pap_email VARCHAR(100), IN pap_domicilio VARCHAR(100), IN pap_id_comuna INT, 
    IN papsu_rut INT, IN papsu_dv CHAR(1), IN papsu_nombres VARCHAR(50), 
    IN papsu_apat VARCHAR(50), IN papsu_amat VARCHAR(50), IN papsu_parentesco VARCHAR(50), 
    IN papsu_fono1 VARCHAR(15), IN papsu_fono2 VARCHAR(15), IN papsu_emergencia TINYINT, 
    IN papsu_email VARCHAR(100), IN papsu_domicilio VARCHAR(100), IN papsu_id_comuna INT, 
    IN pmadre_rut INT, IN pmadre_dv CHAR(1), IN pmadre_nombres VARCHAR(50), 
    IN pmadre_apat VARCHAR(50), IN pmadre_amat VARCHAR(50), IN pmadre_estudios VARCHAR(50), 
    IN pmadre_ocupacion VARCHAR(50), IN ppadre_rut INT, IN ppadre_dv CHAR(1), 
    IN ppadre_nombres VARCHAR(50), IN ppadre_apat VARCHAR(50), IN ppadre_amat VARCHAR(50), 
    IN ppadre_estudios VARCHAR(50), IN ppadre_ocupacion VARCHAR(50)
)
BEGIN
    DECLARE exit HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al procesar datos. Operación revertida.';
    END;

    START TRANSACTION;

    -- Variables locales para IDs
    DECLARE new_id_alumno INT;
    DECLARE new_id_apoderado INT;
    DECLARE new_id_apoderado_supl INT;
    DECLARE new_id_madre INT;
    DECLARE new_id_padre INT;

    -- Apoderado principal
    IF pidapoderado IS NULL THEN
        SELECT id_apoderado INTO new_id_apoderado
        FROM apoderados
        WHERE rut = pap_rut;

        IF new_id_apoderado IS NOT NULL THEN
            -- Actualizar datos del apoderado existente
            UPDATE apoderados
            SET dv = pap_dv, nombres = pap_nombres, apat = pap_apat, amat = pap_amat,
                parentesco = pap_parentesco, fono1 = pap_fono1, fono2 = pap_fono2,
                emergencia = pap_emergencia, email = pap_email, domicilio = pap_domicilio,
                id_comuna = pap_id_comuna
            WHERE id_apoderado = new_id_apoderado;
        ELSE
            -- Insertar nuevo apoderado
            INSERT INTO apoderados (rut, dv, nombres, apat, amat, parentesco, fono1, fono2, emergencia, email, domicilio, id_comuna)
            VALUES (pap_rut, pap_dv, pap_nombres, pap_apat, pap_amat, pap_parentesco, pap_fono1, pap_fono2, pap_emergencia, pap_email, pap_domicilio, pap_id_comuna);
            SET new_id_apoderado = LAST_INSERT_ID();
        END IF;
    ELSE
        SET new_id_apoderado = pidapoderado;
    END IF;

    -- Apoderado suplente
    IF pidapoderadosupl IS NULL THEN
        SELECT id_apoderado INTO new_id_apoderado_supl
        FROM apoderados
        WHERE rut = papsu_rut;

        IF new_id_apoderado_supl IS NOT NULL THEN
            -- Actualizar datos del apoderado suplente existente
            UPDATE apoderados
            SET dv = papsu_dv, nombres = papsu_nombres, apat = papsu_apat, amat = papsu_amat,
                parentesco = papsu_parentesco, fono1 = papsu_fono1, fono2 = papsu_fono2,
                emergencia = papsu_emergencia, email = papsu_email, domicilio = papsu_domicilio,
                id_comuna = papsu_id_comuna
            WHERE id_apoderado = new_id_apoderado_supl;
        ELSE
            -- Insertar nuevo apoderado suplente
            INSERT INTO apoderados (rut, dv, nombres, apat, amat, parentesco, fono1, fono2, emergencia, email, domicilio, id_comuna)
            VALUES (papsu_rut, papsu_dv, papsu_nombres, papsu_apat, papsu_amat, papsu_parentesco, papsu_fono1, papsu_fono2, papsu_emergencia, papsu_email, papsu_domicilio, papsu_id_comuna);
            SET new_id_apoderado_supl = LAST_INSERT_ID();
        END IF;
    ELSE
        SET new_id_apoderado_supl = pidapoderadosupl;
    END IF;

    -- Madre
    IF pmadre_rut IS NOT NULL THEN
        SELECT id_apoderado INTO new_id_madre
        FROM apoderados
        WHERE rut = pmadre_rut;

        IF new_id_madre IS NOT NULL THEN
            -- La madre es un apoderado existente
            UPDATE apoderados
            SET dv = pmadre_dv, nombres = pmadre_nombres, apat = pmadre_apat, amat = pmadre_amat,
                estudios = pmadre_estudios, ocupacion = pmadre_ocupacion
            WHERE id_apoderado = new_id_madre;
        ELSE
            -- Insertar como nueva madre
            INSERT INTO padres (rut, dv, nombres, apat, amat, estudios, ocupacion)
            VALUES (pmadre_rut, pmadre_dv, pmadre_nombres, pmadre_apat, pmadre_amat, pmadre_estudios, pmadre_ocupacion);
            SET new_id_madre = LAST_INSERT_ID();
        END IF;
    ELSE
        SET new_id_madre = NULL;
    END IF;

    -- Repetir lógica similar para el padre...

    -- Inserción del alumno
    INSERT INTO alumno (rut, dv, nombres, apat, amat, fnac, genero, domicilio, id_comuna, currepe, canthnos, nroentrehnos, hnosaca, hnoscursos, enfermo, cuidados,
                        procedencia, promedionota, idvivecon, descripcionvivecon, idcurso, activo, evaluareligion, id_apoderado, id_apoderadosuplente, id_madre, id_padre, fincorpora)
    VALUES (prut, pdv, pnombres, papat, pamat, pfnac, pgenero, pdomicilio, pidcomuna, pcurrepe, pcanthnos, pnroentrehnos, phnosaca, phnoscursos, penfermo, pcuidados,
            pprocedencia, ppromedionota, pidvivecon, pdescripcionvivecon, pidcurso, pactivo, pevaluareligion, new_id_apoderado, new_id_apoderado_supl, new_id_madre, new_id_padre, NOW());
    SET new_id_alumno = LAST_INSERT_ID();

    COMMIT;

    SELECT new_id_alumno AS id_alumno, new_id_apoderado AS id_apoderado, new_id_apoderado_supl AS id_apoderado_suplente, new_id_madre AS id_madre, new_id_padre AS id_padre;
END$$

DELIMITER ;
 ;
*/

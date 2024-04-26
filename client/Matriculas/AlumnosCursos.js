import React, { useState, useContext, useEffect } from "react";
import { Button, Grid, Paper, Stack, createTheme, ThemeProvider, Typography } from '@mui/material'
import { AuthContext } from "../core/AuthProvider";
import auth from "./../auth/auth-helper";

import { api_CantAlumnosCurso, api_NroMatriculas } from "./../docentes/api-docentes";


const abortController = new AbortController();
const signal = abortController.signal;
const jwt = auth.isAuthenticated();


const theme = createTheme({
    palette: {
        secondary: {
            main: '#LightSeaGreen', // Cambia esto al color deseado
        },
    },
});

const VerAlumnosCurso = (nivel, grado, letra) => {
    console.log(`VerAlumnosCurso: cod_grado=${grado}, cod_nivel=${nivel}, letra=${letra}`);
};


const SumarArray = (array) => {
    const totalSumado = array.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.nroAlumnos;
    }, 0)

    return totalSumado
}

const CustomGridTitulo = ({titulo, color, backGround}) => {
    console.log( titulo, color, backGround)
    return(
        <Grid container spacing={2} sx={{ margin: "auto", maxWidth: "95%" }} >
            <Grid item xs={12}>
                <Stack alignItems="felt">
                    <Paper elevation={2} sx={{ pl: 15, pb: 1, pt: 1, backgroundColor:`${backGround}` }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color:`${color}` }}>{titulo}</Typography>
                    </Paper>
                </Stack>
             </Grid>
        </Grid>
 )
}

const CustomPaper = ({ arreglo }) => {
    console.log( "Arreglo: ", arreglo[0])
    return (
        <Grid item xs={6}>
            <Paper elevation={10} sx={{ pb: 1, pt: 1, backgroundColor: '#b0c4de' }}>
                <Stack alignItems="center">
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color:'#ffffff' }}>
                     {arreglo[0].nomlargo} 53; Nro. Matrícula 53
                </Typography>

                    <Grid container spacing={1}>
                        {arreglo.map((elm, ind) => (
                           <CustomGridItem key={ind} label={elm.nomlargo} alumnos={elm.nroAlumnos} onClick={() => VerAlumnosCurso(elm.cod_ense, elm.cod_grado, elm.letra)} />
                        ))}
                    </Grid>
                </Stack>
            </Paper>
        </Grid>
    )
}

const CustomGridItem = ({ label, alumnos, onClick }) => {
    return (
        <Grid item xs={6}>
            <Stack alignItems="center">
                <Paper elevation={6} sx={{ px: 1, pb: 1, pt: 1 }}>
                    <Button variant="contained" color="success" onClick={onClick} sx={{ fontSize: '11px' }}>
                        {label}<br />{alumnos} Alumnos
                    </Button>
                </Paper>
            </Stack>
        </Grid>
    )
}

export default function AlumnosCursos() {
    const { isAuthenticated } = useContext(AuthContext);
    const [DataAlumnosCurso, setDataAlumnosCurso] = useState(false);
    const [DataNroMatricula, setDataNroMatricula] = useState(false);
    const [cursoCargado, setCursoCargado] = useState(false)
    const [nromatriculaCargado, setnromatriculaCargado] = useState(false)
    const [dataCursos, setDataCursos] = useState({ arPk: [], TotalPk: 0, arKi: [], TotalKi: 0, arBa: [], TotalBa: 0, arMe: [], TotalMe: 0 })

    useEffect(() => {
        api_CantAlumnosCurso({ t: jwt.token }, signal).then((data) => {
            if (data && data.error) {
                console.log("**ERROR** Obtener nro.alumnos x curso:", data.error);
            } else {
                const ArrayData = Object.values(data[0])
                setDataAlumnosCurso(ArrayData);
                const arPk = ArrayData.filter( (prebasica) => prebasica.cod_ense === 10 && prebasica.cod_grado === 4);
                const arKi = ArrayData.filter( (prebasica) => prebasica.cod_ense === 10 && prebasica.cod_grado === 5);
                const arBa = ArrayData.filter( (basica) => basica.cod_ense === 110 );
                const arMe = ArrayData.filter( (media) => media.cod_ense === 310  );
                const TotalPk = SumarArray(arPk)
                const TotalKi = SumarArray(arKi)
                const TotalBa = SumarArray(arBa)
                const TotalMe = SumarArray(arMe)
                console.log("Contenido de arPk:", arPk)
                setDataCursos({
                    ...dataCursos,
                    arPk, TotalPk,
                    arKi, TotalKi,
                    arBa, TotalBa,
                    arMe, TotalMe
                })
                setCursoCargado(true)
            }
        });
        api_NroMatriculas({ t: jwt.token }, signal).then((data) => {
            if (data && data.error) {
                console.log("**ERROR** Obtener nro matriculas x curso:", data.error);
            } else {
                setDataNroMatricula(Object.values(data[0]));
                setnromatriculaCargado(true)
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (

        <ThemeProvider theme={theme}>
            <div sx={{ mt: 20 }} style={{ paddingTop: "77px" }}>
                <CustomGridTitulo titulo={'Educación pre Básica'} color={'#FFFFFF'} backGround={'#2E7D32'}/>

                <Grid container spacing={2} sx={{ margin: "auto", maxWidth: "95%" }} >
                    <CustomPaper arreglo={dataCursos.arPk} />
                    <CustomPaper arreglo={dataCursos.arKi} />
                </Grid>
            </div>
        </ThemeProvider >
    )
}

//                                     <CustomGridItem label="Pre Kinder A" alumnos={30} onClick={() => VerAlumnosCurso(10, 4, 'A')} />
// <CustomGridItem label="Pre Kinder A" alumnos={30} onClick={() => VerAlumnosCurso(10, 4, 'A')} />
// <CustomGridItem label="Pre Kinder B" alumnos={22} onClick={() => VerAlumnosCurso(10, 4, 'B')} />


    // 
    // <Grid item xs={6}>
    // <Paper elevation={10} sx={{ pb: 1, pt: 1, backgroundColor: '#b0c4de' }}>
    //     <Stack alignItems="center">
    //         <Grid container spacing={1}>
    //             {dataCursos.arPk.map((elm, ind) => (
    //                 <CustomGridItem key={ind} label={elm.nomlargo} alumnos={elm.nroAlumnos} onClick={() => VerAlumnosCurso(elm.cod_ense, elm.cod_grado, elm.letra)} />
    //             ))}
    //         </Grid>
    //     </Stack>
    // </Paper>
    // </Grid>
    // 




//     <Grid container spacing={2} sx={{ margin: "auto", maxWidth: "95%" }} >
// <Grid item xs={12}>
//     <Stack alignItems="left">
//         <Paper elevation={2} sx={{ pl: 15, pb: 1, pt: 1, backgroundColor: '#2E7D32' }}>
//             <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#FFFFFF' }}>Educación pre Básica</Typography>
//         </Paper>
//     </Stack>
// </Grid>
// </Grid>

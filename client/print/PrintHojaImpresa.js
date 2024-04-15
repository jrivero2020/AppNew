
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Grid } from "@mui/material";
import { FmtoRut } from "../assets/js/FmtoRut";
import { useReactToPrint } from "react-to-print";

function PrintHojaImpresa(props) {
    const datoAlumno = props.data;
    const f = new Date();
    const agno = f.getFullYear();
    const TxtDiaHoy = f.getDate();
    let Codense = datoAlumno.cod_ense
    let Ensenanza = (Codense === 10) ? "Pre-básica" : (Codense === 110) ? "Básica" : "Media"
    let mediano = (agno.toString()).substring(2)

    const TxtMesHoy = () => {
        // eslint-disable-next-line no-array-constructor
        let meses = new Array(
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre"
        );
        return meses[f.getMonth()]
    };



    const componentRef = useRef();
    const navigate = useNavigate();
    //     const nroMatricula = datoAlumno.nro_matricula;
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: "cert-data",
    });

    return (
        <>
            <Grid
                container
                rowSpacing={1}
                sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto",
                    maxWidth: "100%",
                }}
            >
                <Grid item xs={6}>
                    <Typography align="center" sx={{ mx: 0.5, fontSize: 14 }}>
                        <Button onClick={handlePrint}>Imprimir</Button>
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography align="center" sx={{ mx: 0.5, fontSize: 14 }}>
                        <Button onClick={() => navigate(-1)}>Volver</Button>
                    </Typography>
                </Grid>

            </Grid>
            <div style={{ display: "none" }}>
                <div ref={componentRef}>
                    <Box sx={{ paddingTop: "125px", paddingLeft: "158" }}>
                        <Grid container direction="column" >
                            <Grid item>
                                <Typography align="left" sx={{ mx: 0.5, fontSize: 22, ml: '88px' }}>
                                    <b>Colegio Los Conquistadores Cerrillos</b>
                                </Typography>
                            </Grid>

                            <Grid container sx={{
                                paddingTop: "50",
                                alignItems: "left",
                                justifyContent: "left",
                            }}
                            >
                                <Grid item xs={12} sx={{ mt: "46px", ml: '67px' }} >
                                    <Typography align="left" sx={{ mx: 0.5, fontSize: 14, }} >
                                        <b>Resolución exenta
                                            <span style={{ letterSpacing: '26px' }}> </span>
                                            7701
                                            <span style={{ letterSpacing: '41px' }}> </span>
                                            1985
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            9903-1
                                        </b>
                                    </Typography>
                                    <Typography sx={{ mt: '56px' }}>
                                        &nbsp;&nbsp;{datoAlumno.nombres} {datoAlumno.apat}{" "}{datoAlumno.amat}
                                    </Typography>
                                    <Typography sx={{ mt: '16px' }}>
                                        &nbsp;&nbsp;&nbsp;
                                        <span style={{ letterSpacing: '32px' }}> </span>
                                        {FmtoRut(datoAlumno.rut + datoAlumno.dv)}
                                    </Typography>
                                    <Typography sx={{ mt: '20px', ml: '116px' }}>
                                        {datoAlumno.idmatricula}
                                        <span style={{ letterSpacing: '203px' }}> </span>
                                        &nbsp;&nbsp;{agno}
                                    </Typography>
                                    <Typography sx={{ mt: '52px', ml: '103px' }}>
                                        &nbsp;
                                        {datoAlumno.desc_grado}{" "} {datoAlumno.letra}
                                    </Typography>
                                    <Typography sx={{ mt: '19px', ml: '93px' }}>
                                        &nbsp;&nbsp;{Ensenanza}
                                    </Typography>

                                    <Typography align="left" sx={{ mx: 0.5, fontSize: 14, mt: '63px', ml: '51px' }}>
                                        los fines que estime pertinente
                                    </Typography>


                                    <Typography align="left" sx={{ fontWeight: "bold", mx: 0.5, fontSize: 12, mt: '142px' }}>
                                        &nbsp;&nbsp;Cerrillos
                                        <span style={{ letterSpacing: '180px' }}> </span>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{TxtDiaHoy}
                                        <span style={{ letterSpacing: '98x' }}> </span>
                                        &nbsp;&nbsp;&nbsp;<TxtMesHoy />
                                        <span style={{ letterSpacing: '95px' }}> </span>
                                        {mediano}

                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            </div>


        </>
    );
}

export default PrintHojaImpresa;


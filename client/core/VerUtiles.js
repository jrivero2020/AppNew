
import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const WorkerMinJs = "dist/pdfworkermin.js"
const docu = "dist/inicio-escolar-2023.pdf"




function VerUtiles() {
    const [selectedOption, setSelectedOption] = useState(null);

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) => [],
    });


    return (
        <>
            <div style={{
                paddingTop: '160px',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 'auto',
                maxWidth: '70%'
            }}>
                <Typography variant="h3" gutterBottom sx={{ color: 'blue', textAlign: 'center' }}>
                    Útiles escolares año 2023
                </Typography>
            </div>

            <Box sx={{ height: '100vh', paddingTop: '160px' }}>
                <Grid container spacing={2} sx={{ height: '100%' }}>
                    <Grid item xs={12} md={4}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Paper
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'grey.200',
                                        },
                                        backgroundColor: selectedOption === 'option1' ? 'grey.200' : 'white',
                                    }}
                                    onClick={() => handleOptionClick('option1')}
                                >
                                    <Typography>Opción 1</Typography>
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'grey.200',
                                        },
                                        backgroundColor: selectedOption === 'option2' ? 'grey.200' : 'white',
                                    }}
                                    onClick={() => handleOptionClick('option2')}
                                >
                                    <Typography>Opción 2</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12}>
                                <Paper
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            backgroundColor: 'grey.200',
                                        },
                                        backgroundColor: selectedOption === 'option3' ? 'grey.200' : 'white',
                                    }}
                                    onClick={() => handleOptionClick('option3')}
                                >
                                    <Typography>Opción 3</Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 'auto' }}>
                        <Box
                            sx={{
                                height: '100%',
                                backgroundColor: 'white',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {selectedOption ? (
                                <Typography>
                                    Contenido del documento para la opción {selectedOption}
                                    <Card>
                                        <CardContent>

                                            <Worker workerUrl={WorkerMinJs}>
                                                <Viewer fileUrl={docu} plugins={[defaultLayoutPluginInstance]} initialPage={1} />
                                            </Worker>
                                        </CardContent>
                                    </Card>

                                </Typography>
                            ) : (
                                <Typography>Seleccione una opción para ver el contenido del documento</Typography>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}

export default VerUtiles;
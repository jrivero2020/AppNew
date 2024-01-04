import React from 'react';

import { Paper, Typography, Card, CardContent, CardHeader, Grid } from '@mui/material';

import { styled } from '@mui/material/styles';
import VisorPdfFinal from './VisorPdfFinal';
import { archivoPdf } from '../../config/ConfigPdf'
import { useLocation } from 'react-router';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


function VisorPdf() {
    const location = useLocation()
    const idArch = location.state.idArchivo
    const pdfResult = archivoPdf.find(pdf => pdf.id == idArch);

    return (
        <Grid item md={12} sx={{
            paddingTop: '88px',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            maxWidth: '70%'
        }}>
                    <Item  >
                        <Typography variant="h3" gutterBottom sx={{ color: 'blue' }}>
                        {pdfResult.titulo}
                        </Typography>
                    </Item>

            <Card  >

                <CardContent style={{ height: "920px" }}>
                    < VisorPdfFinal ArchivoUrl={pdfResult.archivo} />
                </CardContent>
            </Card>
        </Grid>
    )
}

export default VisorPdf



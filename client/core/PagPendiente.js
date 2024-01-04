import React from 'react';
import { Box, Grid, Paper, Typography, styled } from '@mui/material';

export default function Pendiente() {

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    return (

        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={1} >
                <Grid item xs={12}
                    sx={{ marginLeft: '10px', marginRight: '10px', }}
                    style={{ paddingTop: '40px' }}
                >

                    <Item  >
                        <Typography variant="h3" gutterBottom sx={{ color: 'blue' }}>
                            Página Pendiente año 2023
                        </Typography>
                    </Item>
                </Grid>
            </Grid>
        </Box>

    );
}
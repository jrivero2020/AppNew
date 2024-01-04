import { Card, Button, Typography, CardContent, CardActions, Item, React } from './constantesMui'

function vision() {
    return (
        <Item sx={{ bgcolor: '#465053e0', border: '1px solid' }}>
            <Card sx={{ minWidth: 275, border: '1px solid' }}>
                <CardContent sx={{
                    background: '#dce1e5',
                    color: '#1352e7',
                    border: '5px solid #F57F17',
                    boxShadow: 'inset 0 0 10px #503c02'
                }}>
                    <Typography fontFamily="'Tillana', cursive" variant="h5" component="div" >
                        <span style={{ fontWeight: 'bold' }}>
                            Visión
                        </span>
                    </Typography>
                    <Typography fontFamily="'Tillana', cursive" variant="body2" sx={{ textAlign: 'justify' }} >
                        <span style={{ fontWeight: 'bold' }}>                    La visión de nuestro Colegio es la de seguir perfeccionándose para
                            cumplir con las exigencias de los tiempos, mantener su condición de
                            excelencia y continuar entregando herramientas intelectuales y
                            valóricas para el éxito de nuestro alumnos y desarrollo de nuestro país.
                            <br />
                        </span>

                    </Typography>
                </CardContent>
                <CardActions sx={{ bgcolor: '#465053e0', boxShadow: 'inset 0 0 11px #503c02', justifyContent: 'center' }}>
                    <Button size="small" variant="contained" color="primary">Conozca Más</Button>
                </CardActions>
            </Card>
        </Item>
    )
}

export default vision
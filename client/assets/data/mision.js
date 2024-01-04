import { Card, Button, Typography, CardContent, CardActions, Item, React } from './constantesMui'

function mision() {
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
                            Misión
                        </span>
                    </Typography>
                    <Typography fontFamily="'Tillana', cursive" variant="body2" sx={{ textAlign: 'justify' }} >
                        <span style={{ fontWeight: 'bold' }}>
                            Nuestra misión es formar personas integras, con una firme base valórica,
                            seres autónomos y críticos, que pudiesen, no sólo adaptarse a los cambios
                            abruptos de la sociedad, sino que además fueran parte activa de ella.
                            <br /><br/>
                        </span>
                    </Typography>
                </CardContent>
                <CardActions sx={{ bgcolor: '#465053e0', boxShadow: 'inset 0 0 11px #503c02', justifyContent: 'center' }}>
                    <Button size="small" variant="contained" color="primary" >Conozca Más</Button>
                </CardActions>
            </Card>
        </Item>
    )
}

export default mision
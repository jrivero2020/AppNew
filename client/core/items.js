import React from 'react';
import { Paper, Button } from '@mui/material'

function Item(props)
{
    return (
        <Paper >
            <p>esp1</p>
            <p>esp1</p>
            <p>esp1</p>
            <p>esp1</p>
            <h2>Aqui el Título: {props.item.titulo}</h2>
            <p>salto</p>
            <h2>Aquí la foto: {props.item.foto} :: foto</h2>
            <img src='{props.item.foto}'/>
            <Button className="CheckButton">
                Check it out!
            </Button>
        </Paper>
    )
}

export default Item;
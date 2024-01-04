import React from "react";
import { useEffect, useState } from "react";
import { listar, leer } from "./api-usuario";

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Person from '@mui/icons-material/Person';
import { NavLink } from 'react-router-dom';

export default function lstUsuarios() {
    const [usuarios, setUsuarios] = useState([])

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
        listar(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error)
            } else {
                setUsuarios(data)
            }
        })
        return function cleanuo() {
            abortController.abort()
        }
    }, [])


    usuarios.map((item, i) => (
        console.log( "Item, i", item,i )
    )
    )

    return (

        <Paper elevation={4}>
            <List dense>
                {usuarios.map((item, i) => {
                    return <NavLink to={"/usuario/" + item.idUsuario} key={i}>
                        <ListItem >
                            <ListItemAvatar>
                                <Avatar>
                                    <Person />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={item.NombreUsuario}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"                                        >
                                            {item.apat}   {item.amat}   {item.nombres}
                                        </Typography>
                                        {" — Texto asociado"}
                                    </React.Fragment>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton>
                                    <ArrowForward />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </NavLink>
                })
                }
            </List>
        </Paper>

    )
}




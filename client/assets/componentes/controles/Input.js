import { TextField } from '@mui/material'
import React from 'react'

export default function Input(props) {
    const { name, label, value, onChange } = props

    return (

        <TextField
            inputProps={{ style: { fontSize: '10px', color: "blue" }, }}
            variant='outlined'
            label={label}
            value={value}
            name={name}
            onChange={onChange}
        />
    )
}

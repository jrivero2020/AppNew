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

/*
const CustomTextField = ({ label, value, onChange, type = "text" }) => (
  <TextField
    size="small"
    label={label}
    variant="outlined"
    fullWidth
    type={type}
    value={value}
    onChange={onChange}
  />
);
<Grid item xs={3}>
                <TextField
                  size="small"
                  label="Ap. Materno"
                  variant="outlined"
                  fullWidth
                  value={dataBuscaAl.al_amat}
                  onChange={handleChange("al_amat")}
                />
              </Grid>




return fields.map((field, index) => (
  <Grid item xs={3} key={index}>
    <TextField
      size="small"
      label={field.label}
      variant="outlined"
      fullWidth
      value={field.value}
      onChange={handleChange(field.name)}
    />
  </Grid>
));
*/
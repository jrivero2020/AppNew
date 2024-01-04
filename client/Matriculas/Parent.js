
import React from 'react';
import { cFichaAlumno } from './matriculasCampos';
import { FormControl, FormControlLabel, FormLabel, Grid, Radio,  Stack } from '@mui/material';
import { useForm, Form } from '../assets/componentes/useForm';
import Input from '../assets/componentes/controles/Input'
import RadioGroup from '../assets/componentes/controles/RadioGroup';


export default function DataCols() {

  const {
    valores,
    handleChange,
  } = useForm(cFichaAlumno)




  return (

    <Form>
      <Grid container sx={{ mt: 15 }} spacing={2}>
        <Grid item xs={6}>
          <Stack direction="column" spacing={1} >
            <Input
              inputProps={{ style: { fontSize: '10px', color: "blue" }, }}
              variant='outlined'
              label='R.u.n.'
              value={valores.al_rut}
              name="al_rut"
              onChange={handleChange}
            />
            <Input
              inputProps={{ style: { fontSize: '10px', }, }}
              variant='outlined'
              label='Nombres'
              name="al_nombres"
              value={valores.al_nombres}
              onChange={handleChange}
            />
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <FormControl>
            <FormLabel>Sexo</FormLabel>
            <RadioGroup
              row
              name="al_genero"
              value={valores.al_genero}
              size="small"
              onChange={handleChange}
            >
              <FormControlLabel value="M" control={<Radio size="small" />} label="Masculino" />
              <FormControlLabel value="F" control={<Radio size="small" />} label="Femenino" />
            </RadioGroup>
          </FormControl>

        </Grid>

      </Grid>
    </Form>

  )
}

jsx

import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

const Formulario = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [correo, setCorreo] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [nombres, setNombres] = useState('');
  const [rut, setRut] = useState('');
  const [dv, setDv] = useState('');
  const [rol, setRol] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos
    if (
      nombreUsuario.trim() === '' ||
      password.trim() === '' ||
      correo.trim() === '' ||
      apellidoPaterno.trim() === '' ||
      apellidoMaterno.trim() === '' ||
      nombres.trim() === '' ||
      rut.trim() === '' ||
      dv.trim() === '' ||
      rol.trim() === ''
    ) {
      alert('Por favor, complete todos los campos');
      return;
    }

    // Enviar formulario o realizar alguna acción adicional
    alert('Formulario enviado correctamente');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombre de usuario"
            variant="outlined"
            fullWidth
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Contraseña"
            variant="outlined"
            fullWidth
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Correo electrónico"
            variant="outlined"
            fullWidth
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Apellido paterno"
            variant="outlined"
            fullWidth
            value={apellidoPaterno}
            onChange={(e) => setApellidoPaterno(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Apellido materno"
            variant="outlined"
            fullWidth
            value={apellidoMaterno}
            onChange={(e) => setApellidoMaterno(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nombres"
            variant="outlined"
            fullWidth
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="RUT"
            variant="outlined"
            fullWidth
            value={rut}
            onChange={(e) => setRut(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            label="DV"
            variant="outlined"
            fullWidth
            value={dv}
            onChange={(e) => setDv(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Rol"
            variant="outlined"
            fullWidth
            value={rol}
            onChange={(e) => setRol(e.target.value)}
          />
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" color="primary">
        Enviar
      </Button>
    </form>
  );
};

export default Formulario;



jsx

import React, { useState } from 'react';
import { Button, TextField, Grid, Typography, Container } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { TabletAndroid } from '@mui/icons-material';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rut, setRut] = useState('');
  const [dv, setDv] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos no vacíos
    if (!email || !password || !rut || !dv) {
      console.error('Todos los campos son obligatorios');
      return;
    }

    // Validar RUT con módulo 11
    const rutWithDv = rut + dv;
    if (!validarRut(rutWithDv)) {
      console.error('RUT inválido');
      return;
    }

    try {
      // Aquí deberás agregar la lógica de autenticación con Firebase.
      // El siguiente código es solo un ejemplo de cómo deberías implementarlo
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Usuario registrado exitosamente');
    } catch (error) {
      console.error('Error al registrar usuario', error);
    }
  };

  const validarRut = (rut) => {
    // Validar formato del RUT
    if (!/^0*(\d{1,3}(\.?\d{3})*)\-?([\dkK])$/.test(rut)) {
      return false;
    }
  
    // Quitar puntos y guión del RUT
    rut = rut.replace(/[\.\-]/g, '');
  
    // Calcular DV
    let suma = 0;
    let multiplo = 2;
  
    for (let i = rut.length - 1; i >= 0; i--) {
      suma += parseInt(rut.charAt(i)) * multiplo;
      multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }
  
    const dvCalculado = 11 - (suma % 11);
    const dv = dvCalculado === 10 ? 'k' : dvCalculado.toString();
  
    // Comparar DV calculado con DV ingresado
    return dv === rut.charAt(rut.length - 1).toLowerCase();
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Registro de Usuario
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="RUT"
              fullWidth
              value={rut}
              onChange={(e) => setRut(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="DV"
              fullWidth
              value={dv}
              onChange={(e) => setDv(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Registrarse
        </Button>
      </form>
    </Container>
  );
};

export default Register;

*************************
***   Carga de select ***
**************************
*** sequelize

const Sequelize = require('sequelize');
const express = require('express');
const app = express();

// Configurar Sequelize
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
});

// Verificar conexión a la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida.');
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });

app.listen(3000, () => {
  console.log('Servidor en ejecución en http://localhost:3000');
});


** Modelo de la TabletAndroid
const Item = sequelize.define('Item', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

// Sincronizar el modelo con la base de datos
sequelize.sync().then(() => {
  console.log('Modelo sincronizado con la base de datos.');
});

** Ruta express

app.get('/items', (req, res) => {
  Item.findAll()
    .then((items) => {
      res.json(items);
    })
    .catch((error) => {
      console.error('Error al obtener los items:', error);
      res.status(500).json({ error: 'Error al obtener los items' });
    });
});

** Select 

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, MenuItem } from '@mui/material';

const MyForm = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get('/items')
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los items:', error);
      });
  }, []);

  return (
    <form>
      <Select>
        {items.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.nombre}
          </MenuItem>
        ))}
      </Select>
    </form>
  );
};

export default MyForm;






***************************

import React from "react";
import MaskedInput from "react-text-mask";

const RutMask = (props) => {
  const { inputRef,...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref? ref.inputElement : null);
      }}
      mask={[
        /\d/,
        /\d/,
        /\d/,
        ".",
        /\d/,
        /\d/,
        /\d/,
        ".",
        /\d/,
        /\d/,
        /\d/,
        "-",
        /[kK\d]/,
      ]}
      placeholderChar={"_"}
      showMask
    />
  );
};

export default RutMask;

import React, { useRef } from "react";
import TextField from "@mui/material/TextField";
import RutMask from "./RutMask";

function MyComponent() {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <TextField
        label="RUT"
        variant="outlined"
        fullWidth
        value=""
        onChange={() => {}}
        InputProps={{
          inputComponent: RutMask,
          inputRef: inputRef,
        }}
      />
      <button onClick={handleClick}>Foco</button>
    </div>
  );
}

export default MyComponent;


*****************************
Verifica que el paquete react-rut-formatter esté instalado correctamente ejecutando npm ls react-rut-formatter o yarn list react-rut-formatter.

Asegúrate de que la librería esté listada en el resultado de manera similar a:

bash

└── react-rut-formatter@x.x.x
Si el paquete no está listado, intenta reinstalarlo utilizando npm install react-rut-formatter o yarn add react-rut-formatter.

Verifica que Babel esté configurado correctamente. Puedes probar ejecutando npx babel ./your-file.js para asegurarte de que Babel esté transpilando tu código correctamente. Asegúrate de que la salida incluya import { format } from 'react-rut-formatter' en lugar de la importación CommonJS.

Verifica que estás utilizando una versión de React que soporte los módulos ES. Asegúrate de tener instalada una versión de React igual o superior a 17.

Si después de seguir estos pasos aún tienes problemas para importar la librería react-rut-formatter como un módulo ES, te recomendaría revisar la documentación oficial del paquete y asegurarte de que no haya problemas específicos con la versión que estás utilizando o con tu entorno de desarrollo. También podrías intentar buscar soluciones en foros o comunidades en línea relacionadas con React y la importación de módulos ES.


import React, { useState } from 'react';
import { Grid, TextField } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

const MyForm = () => {
  const [valores, setValores] = useState({
    name: '',
    password: '',
  });

  const [validations, setValidations] = useState({
    name: false,
    password: false,
  });

  const handleChange = (campo) => (event) => {
    setValores({ ..valores, [campo]: event.target.value });
  };

  const validateField = (campo) => {
    // Aquí puedes realizar tus validaciones personalizadas para cada campo
    // Por ejemplo:
    if (campo === 'name' && valores.name.trim() === '') {
      return false;
    }
    if (campo === 'password' && valores.password.length < 6) {
      return false;
    }
    return true;
  };

  const handleBlur = (campo) => () => {
    setValidations({ ...validations, [campo]: validateField(campo) });
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={4}>
        <TextField
          label="Nombre usuario"
          variant="outlined"
          fullWidth
          value={valores.name}
          onChange={handleChange('name')}
          onBlur={handleBlur('name')}
          error={!validations.name}
          InputProps={{
            endAdornment: validations.name && <CheckIcon color="success" />,
          }}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          label="Contraseña"
          variant="outlined"
          fullWidth
          type="password"
          value={valores.password}
          onChange={handleChange('password')}
          onBlur={handleBlur('password')}
          error={!validations.password}
          InputProps={{
            endAdornment: validations.password && <CheckIcon color="success" />,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default MyForm;
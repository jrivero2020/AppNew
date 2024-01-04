// Luego, puedes usar Sequelize para consultar tu base de datos:

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "postgres",
});

const Comuna = sequelize.define(
  "Comuna",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    descripcion: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: "comunas",
    timestamps: false,
  }
);

async function getComunas() {
  return await Comuna.findAll();
}

//Finalmente, puedes usar Material-UI para crear tu ListBox:

import * as React from "react";
import Listbox from "@mui/material/Listbox";
import ListItem from "@mui/material/ListItem";

export default function ComunaSelector() {
  const [comunas, setComunas] = React.useState([]);
  const [selectedComuna, setSelectedComuna] = React.useState(null);

  React.useEffect(() => {
    async function fetchComunas() {
      const comunas = await getComunas();
      setComunas(comunas);
    }

    fetchComunas();
  }, []);

  return (
    <Listbox
      value={selectedComuna}
      onChange={(event) => setSelectedComuna(event.target.value)}
    >
      {comunas.map((comuna) => (
        <ListItem key={comuna.id} value={comuna.id}>
          {comuna.descripcion}
        </ListItem>
      ))}
    </Listbox>
  );
}


// **************************************************************************** //
export default function ComunaSelector() {
  const [comunas, setComunas] = React.useState([]);
  const [selectedComuna, setSelectedComuna] = React.useState(idcomuna); // Asume que idcomuna es el valor que recibes

  React.useEffect(() => {
    async function fetchComunas() {
      const comunas = await getComunas();
      setComunas(comunas);
    }

    fetchComunas();
  }, []);

  return (
    <Listbox value={selectedComuna} onChange={(event) => setSelectedComuna(event.target.value)}>
      {comunas.map((comuna) => (
        <ListItem key={comuna.id} value={comuna.id}>
          {comuna.descripcion}
        </ListItem>
      ))}
    </Listbox>
  );
}

/*
utilizando @mui/material, quiero mostrar una advertencia en una ventana, similar a alert() de javascript, pero que sea personalizable el título, el mensaje y  pueda ser llamada desde cualquier componente de react-javascript


import { Alert } from '@mui/material';

const showWarning = (title, message) => {
  return (
    <Alert severity="warning" onClose={() => setShowWarning(false)} variant="filled">
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
};

import { useState } from 'eact';
import { showWarning } from './warning';

const MyComponent = () => {
  const [showWarning, setShowWarning] = useState(false);

  const handleClick = () => {
    setShowWarning(true);
    showWarning('Advertencia', 'Este es un mensaje de advertencia personalizado.');
  };

  return (
    <div>
      <button onClick={handleClick}>Mostrar advertencia</button>
      {showWarning && <WarningComponent />}
    </div>
  );
};



import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect() {
  const [age, setAge] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={age}
          label="Age"
          onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}




*/


import React from 'react';
import { useEffect, useState } from "react";
import { docenteListarHoras } from './../docentes/api-docentes'
import { Grid, Button, Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Yard } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const styles = {
  root: {
    variant: 'body1',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    fontSize: 12,
  },
};


const diasSemana = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo'
};

/*
const columns = [
  
  { field: 'NOMLARGO', headerName: 'Nombres', width: 150 },
  { field: 'correo',   headerName: 'Correo',  width: 150 },
  { field: 'Dia',      headerName: 'Día',     width: 150 },
  { field: 'hdesde',   headerName: 'Hora',    width: 150 },
  { field: 'hhasta',   headerName: 'Curso',   width: 150 },
];
*/

const columns = [
  { field: 'nombres', headerName: 'Nombres', width: 150 },
  { field: 'apat', headerName: 'Apellido Paterno', width: 150 },
  { field: 'amat', headerName: 'Apellido Materno', width: 150 },
  { field: 'HORA', headerName: 'Hora', width: 150 },
  { field: 'CURSO', headerName: 'Curso', width: 150 },
];

const rows = [
  { nfila: 1, id_profesor: 2, nombres: 'ERICK ORLANDO', apat: 'AGUILAR', amat: 'CELIS', HORA: '10:00', CURSO: '1A' },
  { nfila: 2, id_profesor: 2, nombres: 'ERICK ORLANDO', apat: 'AGUILAR', amat: 'CELIS', HORA: '10:00', CURSO: '2A' },
  { nfila: 3, id_profesor: 10, nombres: 'MARGARITA ISABEL', apat: 'CAMPOS', amat: 'ASTUDILLO', HORA: '10:00', CURSO: '3B' },
  { nfila: 4, id_profesor: 10, nombres: 'MARGARITA ISABEL', apat: 'CAMPOS', amat: 'ASTUDILLO', HORA: '13:00', CURSO: '3B' },
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

let opcion = ''

function DocenteHoras({ datos }) {


  const [selectedOption, setSelectedOption] = useState('pb');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const [dtaDocente, setDocentes] = useState([])

  useEffect(() => {    

    console.log("estoy en useEffect()=====>", selectedOption)
    const abortController = new AbortController()
    const signal = abortController.signal
    opcion = selectedOption ? selectedOption: 'x'
    docenteListarHoras(opcion, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error)
      } else {
        setDocentes(data)
      }
    })
    return function cleanuo() {
      abortController.abort()
    }
  }, [selectedOption])

  console.log("dtaDocente====>", dtaDocente);

  dtaDocente.map((dta, i) => (
    console.log("item=", dta, '  i=', i )
  ) )
  


  return (

    <Grid container spacing={1}>
      <Grid item xs={12}
        sx={{ marginLeft: '10px', marginRight: '10px', }}
        style={{ paddingTop: '100px' }}
      >

        <Item  >
          <Typography variant="h3" gutterBottom sx={{ color: 'blue' }}>
          Horario de atención Docentes
          </Typography>
        </Item>
      </Grid>

      <Grid item xs={2} >
        <Item></Item>
        <Item></Item>
        <Item sx={{ backgroundColor: selectedOption === 1 ? 'grey.400' : 'white', }} >
          <Button variant="contained" sx={{ width: '40%' }} onClick={() => handleOptionClick(1)}>Prekinder</Button>
        </Item>

        <Item sx={{ backgroundColor: selectedOption === 2 ? 'grey.400' : 'white', }} >
          <Button variant="contained" sx={{ width: '40%' }} onClick={() => handleOptionClick(2)}>    Kinder    </Button>
        </Item>
        <Item sx={{ backgroundColor: selectedOption === 3 ? 'grey.400' : 'white', }} >
          <Button variant="contained" sx={{ width: '40%' }} onClick={() => handleOptionClick(3)}>    Básica    </Button>
        </Item>
      </Grid>


      <Grid item xs={10} >
        <Item >
          <Card style={{ maxWidth: '90%', margin: 'auto', height: "920px" }}>           

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombres   </TableCell>
                    <TableCell>Correo    </TableCell>
                    <TableCell>Curso     </TableCell>
                    <TableCell>Día       </TableCell>
                    <TableCell>Hora Desde</TableCell>
                    <TableCell>Hora Hasta</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    dtaDocente.map((dato) => (
                      <TableRow key={dato.nfila}>
                        <TableCell> <Typography sx={styles.root} >{dato.nombres}</Typography></TableCell>
                        <TableCell>{dato.correo}</TableCell>
                        <TableCell>{dato.Cursos}</TableCell>
                        <TableCell>{diasSemana[dato.dia]}</TableCell>
                        <TableCell>{dato.hdesde}</TableCell>
                        <TableCell>{dato.hhasta}</TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Item>
      </Grid>
    </Grid>

  );
}

export default DocenteHoras


/*
Nombres,CorreoDíaHora,DesdeHora,HastaPre BásicaBásic,aMedia
*/


/*

  return (
    <div style={{ paddingTop: '88px' }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombres    </TableCell>
              <TableCell>Correo     </TableCell>
              <TableCell>Día       </TableCell>
              <TableCell>Hora Desde</TableCell>
              <TableCell>Hora Hasta</TableCell>
              <TableCell>Pre Básica</TableCell>
              <TableCell>Básica    </TableCell>
              <TableCell>Media     </TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {dtaDocente.map((dato) => (
              <TableRow key={dato.nfila}>
                <TableCell>{dato.nombres + ' ' + dato.apat + ' ' + dato.amat}</TableCell>
                <TableCell>{dato.correo}</TableCell>
                <TableCell>{diasSemana[dato.dia]}</TableCell>
                <TableCell>{dato.hdesde}</TableCell>
                <TableCell>{dato.hhasta}</TableCell>
                <TableCell>{dato.pb ? 'Pre Básica' : ''}</TableCell>
                <TableCell>{dato.ba ? 'Básica' : ''}</TableCell>
                <TableCell>{dato.me ? 'Media' : ''}</TableCell>
              </TableRow>
            ))
            }
          </TableBody>
        </Table>
      </TableContainer>


    </Grid>
  );
}






    <Grid item xs={2} >
    <Item></Item>
    <Item></Item>
    <Item sx={{ backgroundColor: selectedOption === 4 ? 'grey.400' : 'white', }} >
        <Button variant="contained" sx={{ width: '40%' }} onClick={() => handleOptionClick(4)}>Prekinder</Button>
    </Item>

    <Item sx={{ backgroundColor: selectedOption === 5 ? 'grey.400' : 'white', }} >
        <Button variant="contained" sx={{ width: '40%' }} onClick={() => handleOptionClick(5)}>    Kinder    </Button>
    </Item>
    <Item sx={{ backgroundColor: selectedOption === 6 ? 'grey.400' : 'white', }} >
        <Button variant="contained" sx={{ width: '40%' }} onClick={() => handleOptionClick(6)}>    Básica    </Button>
    </Item>
</Grid>


 */
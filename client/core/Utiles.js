import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const docuPk = "dist/pdf/Lut_prekinder23.pdf"
const docuKi = "dist/pdf/Lut_kinder23.pdf"
const docuBa = "dist/pdf/Lut_basica23.pdf"

let titulo = ""
let subtitulo = ""
let avatar = ""


export default function LabTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const navigate = useNavigate();


  const cargarVisorPdf = (docu, avatar) => {

    <div style={{ paddingTop: '160px' }} >
      este es el padding
      {navigate(`/VisorPdfII?docu=${docu}#avatar=${avatar}`)}
    </div>
  }


  return (
    <div style={{
      paddingTop: '160px',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 'auto',
      maxWidth: '70%'
    }}>
      <Typography variant="h3" gutterBottom sx={{ color:'blue', textAlign:'center'}}> 
        Útiles escolares año 2023
      </Typography>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="PreKinder" value="1" onClick={() => cargarVisorPdf(docuPk,"PK")} />
              <Tab label="Kinder" value="2" onClick={() => cargarVisorPdf(docuKi)} />
              <Tab label="Básica" value="3" onClick={() => cargarVisorPdf(docuBa)} />
            </TabList>
          </Box>
          <TabPanel value="1">Item One </TabPanel>
          <TabPanel value="2">Item Two</TabPanel>
          <TabPanel value="3">Item Three</TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}
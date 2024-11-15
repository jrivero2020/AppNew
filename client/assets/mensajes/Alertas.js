import React, { useState } from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Stack from "@mui/material/Stack";
import { useLocation } from "react-router";
import { Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function Alertas() {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const aMensajes = location.state.aMensajes;
  const aTitulo = location.state.aTitulo;
  const navigate = useNavigate();

  // console.log("Resultado de aMensajes:", aMensajes);
  // console.log("Resultado de aTitulo:", aTitulo);
  return (
    <Stack sx={{ width: "100%" }} spacing={2}>
      <Alert variant="outlined" severity="error">
        This is an error alert — check it out!
      </Alert>
      <Alert variant="outlined" severity="error">
        This is an error alert — check it out!
      </Alert>
      <Collapse in={open}>
        <Alert
          severity="warning"
          onClose={() => {
            setOpen(false);
            navigate(-1);
          }}
        >
          <AlertTitle>{aTitulo}</AlertTitle>
          {aMensajes} — <strong>verifique!</strong>
        </Alert>
      </Collapse>
    </Stack>
  );
}

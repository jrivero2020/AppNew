import { Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "} *JR* Producciones Ltda. {new Date().getFullYear()}
      {"."} .- / Desarrollo para Colegio&nbsp;
      <Link color="inherit" href="https://losconquistadorescerrillos.com/">
        Los Conquistadores
      </Link>{" "}
    </Typography>
  );
}

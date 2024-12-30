import React from "react";
import { Alert, AlertTitle, Snackbar } from "@mui/material";

export const MsgMuestraError = ({ snackbar, setSnackbar }) => {
  const handleCloseSnackbar = () => setSnackbar(null);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open
      onClose={handleCloseSnackbar}
      autoHideDuration={6000}
      direction={"up"}
      slide={"up"}
    >
      <Alert {...snackbar} onClose={handleCloseSnackbar}>
        <AlertTitle>
          {snackbar.severity === "success" ? "Éxito" : "Error"}
        </AlertTitle>
        {snackbar.mensaje}
      </Alert>
    </Snackbar>
  );
};

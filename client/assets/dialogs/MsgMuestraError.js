import React from "react";
import { Alert, AlertTitle, Snackbar } from "@mui/material";

export const MsgMuestraError = ({ handleCloseSnackbar, snackbar }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open
      onClose={handleCloseSnackbar}
      autoHideDuration={3000}
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

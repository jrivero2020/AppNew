import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmationModal = ({ open, title, message, onConfirm, onCancel }) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      TransitionComponent={Transition}
      keepMounted
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          color="primary"
          sx={{
            backgroundColor: "#FF9E80", // Color de fondo
            "&:hover": {
              backgroundColor: "#FF3D00", // Color de fondo al pasar el cursor
            },
          }}
        >
          Rechazar
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          sx={{
            backgroundColor: "lightblue", // Color de fondo
            "&:hover": {
              backgroundColor: "blue", // Color de fondo al pasar el cursor
            },
          }}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;

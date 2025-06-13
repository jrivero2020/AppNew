import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PaymentIcon from "@mui/icons-material/Payment";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BlockIcon from "@mui/icons-material/Block";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { AuthContext } from "./../../core/AuthProvider";
import { postPagoMensualidadAlumno } from "./../../docentes/api-docentes";

// Estilos personalizados para celdas
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: "0.875rem",
}));

const StyledHeaderCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  fontSize: "1rem",
  fontWeight: "bold",
}));

const PagoActualInput = styled(TextField)(({ theme, status, disabled }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: disabled
      ? theme.palette.grey[200]
      : status === "pagado"
      ? theme.palette.success.light
      : status === "parcial"
      ? theme.palette.warning.light
      : "inherit",
    "& input": {
      color: disabled
        ? theme.palette.text.primary
        : status === "pagado"
        ? theme.palette.success.contrastText
        : status === "parcial"
        ? theme.palette.warning.contrastText
        : "inherit",
      textAlign: "right",
      padding: theme.spacing(1),
    },
  },
  width: "120px",
}));

const TotalRowCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: "bold",
  fontSize: "0.875rem",
}));

function FichaPagosAlumno({ alumno, meses, pago, setPagoData }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [pagos, setPagos] = useState([]);
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [comprobante, setComprobante] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [pagoEnSesion, setPagoEnSesion] = useState(0);
  const { jwt } = useContext(AuthContext);

  useEffect(() => {
    setPagos(
      meses.map((mes) => ({
        ...mes,
        monto_base: parseFloat(mes.monto_base || 0),
        monto_pagado: parseFloat(mes.monto_pagado || 0),
        saldo_pendiente: parseFloat(mes.saldo_pendiente || 0),
        monto_sesion: 0,
        editable: mes.estado !== "pagado",
      }))
    );
  }, [meses]);

  // Calcular totales
  const totalAPagar = pagos.reduce((sum, mes) => sum + mes.monto_base, 0);
  const totalPagado = pagos.reduce((sum, mes) => sum + mes.monto_pagado, 0);
  const totalSaldo = pagos.reduce((sum, mes) => sum + mes.saldo_pendiente, 0);

  const handlePagoChange = (index, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue === "" || !isNaN(numericValue)) {
      const nuevosPagos = [...pagos];
      let monto = numericValue === "" ? 0 : parseFloat(numericValue);
      const mesActual = nuevosPagos[index];

      // Validar secuencia de pagos
      if (index > 0) {
        const mesAnterior = nuevosPagos[index - 1];
        const totalPagadoAnterior =
          mesAnterior.monto_pagado + mesAnterior.monto_sesion;
        const saldoAnterior = mesAnterior.monto_base - totalPagadoAnterior;

        if (monto > 0 && saldoAnterior > 0) {
          setSnackbar({
            open: true,
            message: `Debe completar el pago de ${
              mesAnterior.nombre_mes
            } (falta ${formatCurrency(saldoAnterior)}) primero`,
            severity: "error",
          });
          return;
        }
      }

      // Distribución automática si el monto excede el saldo del mes actual
      if (monto > mesActual.monto_base - mesActual.monto_pagado) {
        const excedente =
          monto - (mesActual.monto_base - mesActual.monto_pagado);
        let montoRestante = excedente;
        let currentIndex = index + 1;

        // Pagar el mes actual completamente
        nuevosPagos[index] = {
          ...mesActual,
          monto_sesion: mesActual.monto_base - mesActual.monto_pagado,
          saldo_pendiente: 0,
          estado: "pagado",
        };

        // Distribuir el excedente en meses siguientes
        while (montoRestante > 0 && currentIndex < nuevosPagos.length) {
          const mes = nuevosPagos[currentIndex];

          // No modificar meses ya pagados
          if (mes.estado === "pagado") {
            currentIndex++;
            continue;
          }

          const saldoMes = mes.monto_base - mes.monto_pagado;
          const pagoActual = Math.min(montoRestante, saldoMes);

          nuevosPagos[currentIndex] = {
            ...mes,
            monto_sesion: mes.monto_sesion + pagoActual,
            saldo_pendiente:
              mes.monto_base -
              (mes.monto_pagado + mes.monto_sesion + pagoActual),
            estado:
              mes.monto_pagado + mes.monto_sesion + pagoActual >= mes.monto_base
                ? "pagado"
                : mes.monto_pagado + mes.monto_sesion + pagoActual > 0
                ? "parcial"
                : "pendiente",
          };

          montoRestante -= pagoActual;
          currentIndex++;
        }

        if (montoRestante > 0) {
          setSnackbar({
            open: true,
            message: `Se distribuyó el pago en los meses siguientes, pero quedó un excedente de ${formatCurrency(
              montoRestante
            )}`,
            severity: "warning",
          });
        }
      } else {
        // Monto normal (menor o igual al saldo del mes)
        nuevosPagos[index] = {
          ...mesActual,
          monto_sesion: monto,
          saldo_pendiente:
            mesActual.monto_base - (mesActual.monto_pagado + monto),
          estado:
            mesActual.monto_pagado + monto >= mesActual.monto_base
              ? "pagado"
              : mesActual.monto_pagado + monto > 0
              ? "parcial"
              : "pendiente",
        };
      }

      // Calcular total pagado en esta sesión
      const totalSesion = nuevosPagos.reduce(
        (sum, m) => sum + m.monto_sesion,
        0
      );
      setPagoEnSesion(totalSesion);

      setPagos(nuevosPagos);
    }
  };

  const handleCancelar = () => {
    setPagos(
      pagos.map((mes) => ({
        ...mes,
        monto_sesion: 0,
        saldo_pendiente: mes.monto_base - mes.monto_pagado,
        estado:
          mes.monto_pagado >= mes.monto_base
            ? "pagado"
            : mes.monto_pagado > 0
            ? "parcial"
            : "pendiente",
      }))
    );
    setPagoEnSesion(0);
  };

  const handleGrabar = async () => {
    setLoading(true);
    const abortController = new AbortController();
    const signal = abortController.signal;
    const usrId = jwt.user._id;

    const pagosAGrabar = pagos
      .filter((mes) => mes.monto_sesion > 0)
      .map((mes) => ({
        rut_alumno: alumno.rut,
        mes: mes.mes,
        agno: new Date().getFullYear(),
        monto_esperado: mes.monto_base,
        monto_transaccion: mes.monto_sesion,
        metodo_pago: metodoPago,
        comprobante: comprobante || null,
      }));

    try {
      const response = await postPagoMensualidadAlumno(
        { pagos: pagosAGrabar, usrId: usrId },
        { t: jwt.token },
        signal
      );

      console.log("Vuelta del sp con response:", response);
      console.log("Pagos enviados (pagosAGrabar):", pagosAGrabar);
      console.log("Resultados recibidos:", response.resultados);

      // Crear un mapa de pagos enviados
      const pagosEnviadosMap = new Map(
        pagosAGrabar.map((p) => [`${alumno.rut}-${p.mes}`, p])
      );

      // Crear un mapa de resultados, sumando monto_transaccion por mes
      const resultadosMap = new Map();
      response.resultados.forEach((r) => {
        const key = `${r.rut_alumno}-${r.mes}`;
        const existing = resultadosMap.get(key) || {
          monto_transaccion: 0,
          monto_pagado: 0,
          saldo_posterior: r.saldo_posterior,
          estado: r.estado,
        };
        resultadosMap.set(key, {
          ...existing,
          monto_transaccion: existing.monto_transaccion + (r.monto_transaccion || 0),
          monto_pagado: (r.monto_pagado || 0) + (r.monto_transaccion || 0),
          saldo_posterior: r.saldo_posterior,
          estado: r.estado,
        });
      });
      console.log("resultadosMap:", Array.from(resultadosMap.entries()));

      // Actualizar pagos
      setPagos((prevPagos) =>
        prevPagos.map((mes) => {
          const key = `${alumno.rut}-${mes.mes}`;
          const pagoProcesado = resultadosMap.get(key);
          const pagoEnviado = pagosEnviadosMap.get(key);

          if (pagoProcesado) {
            return {
              ...mes,
              monto_pagado: mes.monto_pagado + (pagoProcesado.monto_pagado || pagoProcesado.monto_transaccion),
              monto_sesion: 0,
              saldo_pendiente: pagoProcesado.saldo_posterior,
              estado: pagoProcesado.estado,
              editable: pagoProcesado.estado !== "pagado",
            };
          } else if (pagoEnviado) {
            const nuevoMontoPagado = mes.monto_pagado + pagoEnviado.monto_transaccion;
            const nuevoSaldoPendiente = mes.monto_base - nuevoMontoPagado;
            return {
              ...mes,
              monto_pagado: nuevoMontoPagado,
              monto_sesion: 0,
              saldo_pendiente: nuevoSaldoPendiente,
              estado:
                nuevoMontoPagado >= mes.monto_base
                  ? "pagado"
                  : nuevoMontoPagado > 0
                  ? "parcial"
                  : "pendiente",
              editable: nuevoMontoPagado < mes.monto_base,
            };
          }
          return {
            ...mes,
            monto_sesion: 0,
          };
        })
      );

      setSnackbar({
        open: true,
        message: `Pagos registrados correctamente. Total cancelado: ${formatCurrency(
          response.montoTotalCancelado
        )}`,
        severity: "success",
      });
      setPagoEnSesion(0);
      setOpenConfirm(false);
    } catch (error) {
      console.error("Error en handleGrabar:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "Error de conexión con el servidor",
        severity: "error",
      });
      setOpenConfirm(false);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3, mt:isMobile ? 0 :3 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Gestión de Pagos del Alumno
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Typography>
              <strong>RUT:</strong> {alumno.rut}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography>
              <strong>Nombre:</strong> {alumno.nombre}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography>
              <strong>Curso:</strong> {alumno.curso}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={alumno.descuento > 0 ? 3 : 12}>
            <Typography>
              <strong>Mensualidad:</strong> {formatCurrency(alumno.monto_base)}
            </Typography>
          </Grid>

          {alumno.descuento > 0 && (
            <>
              <Grid item xs={12} sm={3}>
                <Typography>
                  <strong>Descuento:</strong> {formatCurrency(alumno.descuento)}{" "}
                  ({alumno.porcentaje_asignado}%)
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography>
                  <strong>Monto:</strong>{" "}
                  {formatCurrency(alumno.monto_base - alumno.descuento)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Typography>
                  <strong>Beca:</strong> {alumno.tipo_beca}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      <TableContainer component={Paper} elevation={3} sx={{ mt: 1 }}>
        <Table size="small" sx={{ "& .MuiTableCell-root": { py: 0.5 } }}>
          <TableHead>
            <TableRow>
              <StyledHeaderCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
              >
                Mes
              </StyledHeaderCell>
              <StyledHeaderCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
                align="right"
              >
                A Pagar
              </StyledHeaderCell>
              <StyledHeaderCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
                align="right"
              >
                Pagado
              </StyledHeaderCell>
              <StyledHeaderCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
                align="right"
              >
                Saldo
              </StyledHeaderCell>
              <StyledHeaderCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
                align="right"
              >
                Pago Actual
              </StyledHeaderCell>
              <StyledHeaderCell
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: "white",
                }}
                align="center"
              >
                Estado
              </StyledHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagos.map((mes, index) => (
              <TableRow key={mes.mes} hover>
                <StyledTableCell>{mes.nombre_mes}</StyledTableCell>
                <StyledTableCell align="right">
                  {formatCurrency(mes.monto_base)}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {formatCurrency(mes.monto_pagado)}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {formatCurrency(mes.saldo_pendiente)}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <PagoActualInput
                    type="number"
                    size="small"
                    value={mes.monto_sesion || ""}
                    onChange={(e) => handlePagoChange(index, e.target.value)}
                    disabled={!mes.editable}
                    status={mes.estado}
                    inputProps={{
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      autoComplete: "off",
                    }}
                    InputProps={{
                      startAdornment: !mes.editable ? (
                        <InputAdornment position="start">
                          <BlockIcon fontSize="small" color="disabled" />
                        </InputAdornment>
                      ) : null,
                    }}
                    sx={{ width: isMobile ? 80 : 120 }}
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Chip
                    label={mes.estado}
                    size="small"
                    color={
                      mes.estado === "pagado"
                        ? "success"
                        : mes.estado === "parcial"
                        ? "warning"
                        : "error"
                    }
                  />
                </StyledTableCell>
              </TableRow>
            ))}

            {/* Fila de totales */}
            <TableRow>
              <TotalRowCell>Totales</TotalRowCell>
              <TotalRowCell align="right">
                {formatCurrency(totalAPagar)}
              </TotalRowCell>
              <TotalRowCell align="right">
                {formatCurrency(totalPagado)}
              </TotalRowCell>
              <TotalRowCell align="right">
                {formatCurrency(totalSaldo)}
              </TotalRowCell>
              <TotalRowCell align="right">
                {formatCurrency(pagoEnSesion)}
              </TotalRowCell>
              <TotalRowCell align="center">
                <Chip
                  label={totalSaldo === 0 ? "Completo" : "Pendiente"}
                  size="small"
                  color={totalSaldo === 0 ? "success" : "warning"}
                  sx={{ color: "white" }}
                />
              </TotalRowCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Paper elevation={3} sx={{ p: 2, mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography>
              <strong>Total a pagar en esta sesión:</strong>{" "}
              {formatCurrency(pagoEnSesion)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Pago con</InputLabel>
              <Select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                label="Pago con"
              >
                <MenuItem value="efectivo">Efectivo</MenuItem>
                <MenuItem value="transferencia">Transferencia</MenuItem>
                <MenuItem value="tarjeta">Tarjeta</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              size="small"
              label="N° Comprobante"
              value={comprobante}
              onChange={(e) => setComprobante(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setPagoData(null)}
          startIcon={<CancelIcon />}
          
        >
          Otro Alumno
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCancelar}
          startIcon={<CancelIcon />}
          disabled={pagoEnSesion === 0}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenConfirm(true)}
          disabled={pagoEnSesion <= 0}
          startIcon={<PaymentIcon />}
        >
          Registrar Pago
        </Button>
      </Box>

      <Dialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="confirm-dialog-title"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <PaymentIcon />
          Confirmar Pago
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography id="confirm-dialog-description" variant="body1" gutterBottom>
            ¿Está seguro de registrar el siguiente pago?
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Total a pagar"
                secondary={formatCurrency(pagoEnSesion)}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ReceiptIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Método de pago"
                secondary={metodoPago.charAt(0).toUpperCase() + metodoPago.slice(1)}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ReceiptIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Comprobante"
                secondary={comprobante || "Sin número"}
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleGrabar}
            color="primary"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Procesando..." : "Confirmar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            bgcolor:
              snackbar.severity === "success"
                ? theme.palette.success.dark
                : theme.palette.error.dark,
            color: theme.palette.common.white,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
export default FichaPagosAlumno;
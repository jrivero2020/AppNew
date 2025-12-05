/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  DataGrid,
  GridRowModes,
  GridActionsCellItem,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import {
  Button,
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Add, Edit, Delete, Save, Cancel } from "@mui/icons-material";
import { esES } from "@mui/x-data-grid/locales";
import {
  getPagosConfigMontos,
  UpsertPagosConfigMontos,
  DeletePagosConfigMontos,
} from "../../docentes/api-docentes";

function EditToolbar({ setRows, setRowModesModel }) {
  const handleClick = () => {
    const id = "new";
    setRows((oldRows) => [
      ...oldRows,
      { id, agno: "", monto: "", isNew: true },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "agno" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<Add />} onClick={handleClick}>
        Agregar
      </Button>
    </GridToolbarContainer>
  );
}

const computeMutation = (newRow, oldRow) => {
  let ret = "";
  let salto = "\n";
  if (newRow.agno !== oldRow.agno) {
    ret += `Año de ${oldRow.agno || ""} a ${newRow.agno || ""}${salto}`;
  }
  if (newRow.monto !== oldRow.monto) {
    ret += `Monto de $${Number(oldRow.monto || 0).toLocaleString(
      "es-CL"
    )} a $${Number(newRow.monto || 0).toLocaleString("es-CL")}${salto}`;
  }
  return ret;
};

const ConfigMonto = ({ credentials, onSelectYear }) => {
  //   console.log("credentials=>", credentials, " onSelectYear=>", onSelectYear);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [rowModesModel, setRowModesModel] = useState({});
  const [promiseArguments, setPromiseArguments] = useState(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });
  const noButtonRef = useRef(null);

  // Fetch data from API
  useEffect(() => {
    const controller = new AbortController();
    fetchConfigMontos(controller.signal);
    return () => controller.abort();
  }, []);

  const fetchConfigMontos = async (signal) => {
    setLoading(true);
    try {
      const data = await getPagosConfigMontos(credentials, signal);
      if (data.error) {
        throw new Error(data.message);
      }
      const dataArray = Object.values(data);
      const processedData = dataArray
        .filter(
          (row) =>
            row && row.id != null && row.agno != null && row.monto != null
        )
        .map((row) => ({
          id: row.id,
          agno: parseInt(row.agno),
          monto: Number(row.monto),
        }));
      console.log("Processed data:", processedData);
      setRows(processedData);
      if (
        processedData.length <=
        paginationModel.page * paginationModel.pageSize
      ) {
        setPaginationModel((prev) => ({
          ...prev,
          page: Math.max(
            0,
            Math.floor((processedData.length - 1) / prev.pageSize)
          ),
        }));
      }
      console.log(
        "fetchConfigMontos - updated rows:",
        processedData,
        "paginationModel:",
        paginationModel
      );
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error al cargar los montos",
        severity: "error",
      });
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle row edit stop
  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowModes.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  // Handle edit click
  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  // Handle save click
  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  // Handle delete click
  const handleDeleteClick = (id) => () => {
    setSnackbar({
      open: true,
      message: "¿Está seguro de eliminar este registro?",
      severity: "warning",
      action: (
        <Box>
          <Button
            sx={{ color: "success.main" }}
            onClick={() => confirmDelete(id)}
            startIcon={<Delete />}
          >
            Confirmar
          </Button>
          <Button
            sx={{ color: "error.main" }}
            onClick={() =>
              setSnackbar({
                open: false,
                message: "",
                severity: "info",
                action: null,
              })
            }
            startIcon={<Cancel />}
          >
            Cancelar
          </Button>
        </Box>
      ),
    });
  };
  const confirmDelete = async (id) => {
    const row = rows.find((r) => r.id === id);
    console.log("confirmDelete - id:", id, "row:", row);
    if (row?.isNew) {
      // If the row is new, remove it locally without calling the API
      setRows(rows.filter((r) => r.id !== id));
      setSnackbar({
        open: true,
        message: "Fila cancelada correctamente",
        severity: "success",
      });
      onSelectYear?.(null);
      // Adjust pagination if necessary
      if (rows.length <= paginationModel.page * paginationModel.pageSize) {
        setPaginationModel((prev) => ({
          ...prev,
          page: Math.max(0, prev.page - 1),
        }));
      }
      console.log(
        "confirmDelete - updated rows:",
        rows.filter((r) => r.id !== id),
        "paginationModel:",
        paginationModel
      );
      return;
    }
    try {
      const response = await DeletePagosConfigMontos(id, credentials);
      if (response.error) {
        throw new Error(response.message);
      }
      setSnackbar({
        open: true,
        message: "Monto eliminado correctamente",
        severity: "success",
      });
      onSelectYear?.(null);
      // Refresh data from API to ensure synchronization
      await fetchConfigMontos(new AbortController().signal);
      console.log(
        "confirmDelete - after fetchConfigMontos, rows:",
        rows,
        "paginationModel:",
        paginationModel
      );
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error al eliminar el monto",
        severity: "error",
      });
    }
  };

  // Handle cancel click
  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  // Validate row data
  const validateRow = (row) => {
    const errors = {};
    const agnoStr = String(row.agno ?? "");
    if (!agnoStr || !/^\d{4}$/.test(agnoStr)) {
      errors.agno = "El año debe ser un número de 4 dígitos";
    } else if (parseInt(agnoStr, 10) < 2000 || parseInt(agnoStr, 10) > 2030) {
      errors.agno = "El año debe estar entre 2000 y 2030";
    }
    const montoStr = String(row.monto ?? "");
    if (!montoStr || !/^\d+$/.test(montoStr)) {
      errors.monto = "El monto debe ser un número entero positivo";
    }
    return errors;
  };

  // Process row update
  const processRowUpdate = useCallback(
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        console.log("processRowUpdate - newRow:", newRow, "oldRow:", oldRow);
        const errors = validateRow(newRow);
        if (Object.keys(errors).length > 0) {
          setSnackbar({
            open: true,
            message: errors.agno || errors.monto,
            severity: "error",
          });
          reject(oldRow);
          return;
        }
        const mutation = computeMutation(newRow, oldRow);
        if (mutation) {
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          resolve(oldRow);
        }
      }),
    []
  );

  // Handle row modes model change
  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // Handle row click for selection
  const handleRowClick = (params) => {
    if (
      params.row &&
      params.row.id !== "new" &&
      rowModesModel[params.row.id]?.mode !== GridRowModes.Edit
    ) {
      onSelectYear(params.row.agno);
    }
  };

  // Handle process row update error
  const handleProcessRowUpdateError = (error) => {
    console.error("Error al procesar la actualización de la fila:", error);
    setSnackbar({
      open: true,
      message: "Error al procesar los cambios",
      severity: "error",
    });
  };

  // Handle dialog confirmation
  //   const handleNo = () => {
  //     const { oldRow, resolve } = promiseArguments;
  //     resolve(oldRow);
  //     setPromiseArguments(null);
  //   };
  const handleNo = () => {
    const { newRow, oldRow, resolve } = promiseArguments;
    console.log("handleNo - newRow:", newRow, "oldRow:", oldRow);
    if (newRow.isNew) {
      setRows(rows.filter((row) => row.id !== newRow.id));
    }
    resolve(oldRow);
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow, reject, resolve } = promiseArguments;
    try {
      const response = await UpsertPagosConfigMontos(
        {
          agno: parseInt(newRow.agno, 10),
          monto: parseInt(newRow.monto, 10),
        },
        credentials
      );
      if (response.error) {
        throw new Error(response.message);
      }
      setSnackbar({
        open: true,
        message: "Monto guardado correctamente",
        severity: "success",
      });
      resolve({ ...newRow, id: response.id || newRow.id, isNew: false });
      setPromiseArguments(null);
      fetchConfigMontos();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar el monto",
        severity: "error",
      });
      reject(newRow);
      setPromiseArguments(null);
    }
  };

  const handleEntered = () => {
    noButtonRef.current?.focus();
  };

  // Render confirm dialog
  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }
    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);
    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle sx={{ backgroundColor: "blue", color: "white" }}>
          ¿Está seguro?
        </DialogTitle>
        <DialogContent
          dividers
          style={{
            whiteSpace: "pre-line",
            fontFamily: "Arial",
            fontSize: "18px",
          }}
        >
          {`Presione 'Sí' para efectuar los cambios:\n${mutation}`}
        </DialogContent>
        <DialogActions>
          <Button
            ref={noButtonRef}
            onClick={handleNo}
            color="error"
            variant="contained"
          >
            No
          </Button>
          <Button onClick={handleYes} color="success" variant="contained">
            Sí
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Memoize columns
  const columns = useMemo(
    () => [
      {
        field: "agno",
        headerName: "Año",
        width: 100,
        editable: true,
        type: "number",
        valueGetter: (value, row) => {
          console.log("valueGetter agno - value:", value, "row:", row);
          return row.agno ?? "";
        },
      },
      {
        field: "monto",
        headerName: "Monto (CLP)",
        width: 150,
        editable: true,
        type: "number",
        valueGetter: (value, row) => {
          console.log("valueGetter monto - value:", value, "row:", row);
          return row.monto ?? "";
        },
        renderCell: (params) => {
          console.log(
            "renderCell monto - params.value:==>",
            params.value,
            "params.row:==>",
            params.row
          );
          const value = params.row.monto;
          return value != null && value !== ""
            ? `$${Number(value).toLocaleString("es-CL")}`
            : "$0";
        },
      },
      {
        field: "actions",
        headerName: "Acciones",
        width: 150,
        type: "actions",
        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          if (isInEditMode) {
            return [
              <GridActionsCellItem
                icon={<Save />}
                label="Save"
                sx={{ color: "primary.main" }}
                onClick={handleSaveClick(id)}
              />,
              <GridActionsCellItem
                icon={<Cancel />}
                label="Cancel"
                color="error"
                onClick={handleCancelClick(id)}
              />,
            ];
          }
          return [
            <GridActionsCellItem
              icon={<Edit />}
              label="Edit"
              color="primary"
              onClick={handleEditClick(id)}
            />,
            <GridActionsCellItem
              icon={<Delete />}
              label="Delete"
              color="error"
              onClick={handleDeleteClick(id)}
            />,
          ];
        },
      },
    ],
    [rowModesModel]
  );

  return (
    <Card sx={{ maxWidth: 500, boxShadow: 3 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Configuración de Montos</Typography>
        </Box>
        <div style={{ height: 400, width: "100%" }}>
          {renderConfirmDialog()}
          <DataGrid
            rows={rows}
            columns={columns}
            editMode="row"
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            pageSizeOptions={[5]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            loading={loading}
            onRowClick={handleRowClick}
            slots={{ toolbar: EditToolbar }}
            slotProps={{ toolbar: { setRows, setRowModesModel } }}
            sx={{
              "& .MuiDataGrid-row:hover": { cursor: "pointer" },
              "& .MuiDataGrid-row.Mui-selected": { backgroundColor: "#e3f2fd" },
            }}
            disableSelectionOnClick={loading || rows.length === 0}
          />
          <Snackbar
            open={snackbar.open}
            autoHideDuration={snackbar.action ? null : 4000}
            onClose={() =>
              setSnackbar({
                open: false,
                message: "",
                severity: "info",
                action: null,
              })
            }
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            {snackbar.action ? (
              <Alert
                severity={snackbar.severity}
                sx={{ width: "100%", backgroundColor: "white", color: "black" }}
                action={snackbar.action}
              >
                <AlertTitle>
                  {snackbar.severity === "success"
                    ? "Éxito"
                    : snackbar.severity === "error"
                    ? "Error"
                    : "Advertencia"}
                </AlertTitle>
                {snackbar.message}
              </Alert>
            ) : (
              <Alert
                onClose={() =>
                  setSnackbar({
                    open: false,
                    message: "",
                    severity: "info",
                    action: null,
                  })
                }
                severity={snackbar.severity}
                sx={{ width: "100%" }}
              >
                <AlertTitle>
                  {snackbar.severity === "success" ? "Éxito" : "Error"}
                </AlertTitle>
                {snackbar.message}
              </Alert>
            )}
          </Snackbar>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfigMonto;

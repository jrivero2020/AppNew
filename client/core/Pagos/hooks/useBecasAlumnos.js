// hooks/useBecasAlumnos.js
// import { useState, useEffect, useCallback, useContext } from 'react';
// import { AuthContext } from "../../../core/AuthProvider";
import { useState, useEffect, useCallback } from 'react';
import {
  getBecasAlumnos,
  UpsertBecaAlumno,
  DeleteBecaAlumno,
  buscarAlumnos
} from '../api/docentes';

export const useBecasAlumnos = (jwt, selectedYear, montoConfig, tiposBeca) => {
  // Estado inicial
  const [state, setState] = useState({
    becas: [],
    alumnos: [],
    searchQuery: '',
    selectedAlumno: null,
    nuevo: {
      rut_alumno: '',
      id_tipo_beca: '',
      porcentaje_asignado: null,
      montodescuento: null,
      apagar: null,
      agno: selectedYear,
      observaciones: ''
    },
    loading: false,
    error: null,
    alert: null
  });

  // Calcular valores de beca basado en tipo y porcentaje
  const calcularValoresBeca = useCallback((tipoId, porcentajeAsignado) => {
    if (!montoConfig) return { montodescuento: null, apagar: null };
    
    const tipo = tiposBeca.find(t => t.id === tipoId);
    const porcentaje = tipo?.porcentaje_fijo || porcentajeAsignado;
    
    if (!porcentaje) return { montodescuento: null, apagar: null };
    
    const montodescuento = Math.ceil(montoConfig * (porcentaje / 100));
    return {
      montodescuento,
      apagar: Math.ceil(montoConfig - montodescuento)
    };
  }, [montoConfig, tiposBeca]);

  // Cargar becas de alumnos
  const fetchData = useCallback(async (signal) => {
    if (!selectedYear) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await getBecasAlumnos({ t: jwt.token, agno: selectedYear }, signal);
      if (data.error) throw new Error(data.message);
      
      setState(prev => ({
        ...prev,
        becas: Object.values(data),
        loading: false
      }));
    } catch (error) {
      if (error.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }));
      }
    }
  }, [jwt.token, selectedYear]);

  // Buscar alumnos
  const searchAlumnos = useCallback(async (query) => {
    if (query.length < 3) return;
    
    try {
      const data = await buscarAlumnos({ t: jwt.token, query });
      if (data.error) throw new Error(data.message);
      
      setState(prev => ({
        ...prev,
        alumnos: Object.values(data),
        searchQuery: query
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message
      }));
    }
  }, [jwt.token]);

  // Seleccionar alumno
  const setSelectedAlumno = useCallback((alumno) => {
    if (!alumno) return;
    
    setState(prev => ({
      ...prev,
      selectedAlumno: alumno,
      nuevo: {
        ...prev.nuevo,
        rut_alumno: alumno.rut,
        agno: selectedYear
      }
    }));
  }, [selectedYear]);

  // Guardar o actualizar beca de alumno
  const handleSave = useCallback(async (beca) => {
    try {
      // Validaciones
      if (!beca.rut_alumno) throw new Error('Seleccione un alumno');
      if (!beca.id_tipo_beca) throw new Error('Seleccione un tipo de beca');
      
      // Validar que no exista ya esta beca para el alumno en el mismo año
      const becaExistente = state.becas.some(b => 
        b.id !== beca.id && 
        b.rut_alumno === beca.rut_alumno && 
        b.id_tipo_beca === beca.id_tipo_beca &&
        b.agno === selectedYear
      );
      
      if (becaExistente) {
        throw new Error('Este alumno ya tiene este tipo de beca asignado para el año seleccionado');
      }

      const result = await UpsertBecaAlumno(beca, { t: jwt.token });
      if (result.error) throw new Error(result.message);
      
      await fetchData();
      return { 
        success: true, 
        message: beca.id ? 'Beca actualizada' : 'Beca asignada' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Error al guardar la beca' 
      };
    }
  }, [jwt.token, selectedYear, state.becas, fetchData]);

  // Asignar nueva beca a alumno
  const handleAdd = useCallback(async () => {
    const result = await handleSave(state.nuevo);
    
    if (result.success) {
      // Resetear formulario
      setState(prev => ({
        ...prev,
        nuevo: {
          rut_alumno: '',
          id_tipo_beca: '',
          porcentaje_asignado: null,
          montodescuento: null,
          apagar: null,
          agno: selectedYear,
          observaciones: ''
        },
        selectedAlumno: null,
        alert: { type: 'success', message: result.message }
      }));
    } else {
      setState(prev => ({
        ...prev,
        alert: { type: 'error', message: result.message }
      }));
    }
    
    return result;
  }, [state.nuevo, handleSave, selectedYear]);

  // Eliminar beca de alumno
  const handleDelete = useCallback(async (id) => {
    try {
      if (!id) throw new Error('ID no válido');
      
      const result = await DeleteBecaAlumno(id, { t: jwt.token });
      if (result.error) throw new Error(result.message);
      
      // Actualización optimista
      setState(prev => ({
        ...prev,
        becas: prev.becas.filter(beca => beca.id !== id),
        alert: { type: 'success', message: 'Beca eliminada' }
      }));
      
      return { success: true };
    } catch (error) {
      setState(prev => ({
        ...prev,
        alert: { type: 'error', message: error.message }
      }));
      return { success: false };
    }
  }, [jwt.token]);

  // Actualizar campo en beca existente
  const handleChange = useCallback((index, key, value) => {
    setState(prev => {
      const updated = [...prev.becas];
      
      // Conversión de tipos para campos numéricos
      const parsedValue = ['porcentaje_asignado', 'montodescuento', 'apagar'].includes(key) 
        ? (value ? parseFloat(value) : null)
        : value;
      
      updated[index][key] = parsedValue;
      
      // Recalcular si cambió el tipo de beca o el porcentaje
      if (key === 'id_tipo_beca' || key === 'porcentaje_asignado') {
        const tipoId = key === 'id_tipo_beca' ? value : updated[index].id_tipo_beca;
        const porcentaje = key === 'porcentaje_asignado' ? parsedValue : updated[index].porcentaje_asignado;
        
        const { montodescuento, apagar } = calcularValoresBeca(tipoId, porcentaje);
        updated[index].montodescuento = montodescuento;
        updated[index].apagar = apagar;
      }
      
      return { ...prev, becas: updated };
    });
  }, [calcularValoresBeca]);

  // Actualizar formulario de nueva beca
  const setNuevo = useCallback((nuevo) => {
    setState(prev => {
      const nuevoState = { ...prev, nuevo: { ...prev.nuevo, ...nuevo } };
      
      // Recalcular si cambió el tipo de beca o el porcentaje
      if (nuevo.id_tipo_beca !== undefined || nuevo.porcentaje_asignado !== undefined) {
        const tipoId = nuevo.id_tipo_beca !== undefined ? nuevo.id_tipo_beca : prev.nuevo.id_tipo_beca;
        const porcentaje = nuevo.porcentaje_asignado !== undefined ? nuevo.porcentaje_asignado : prev.nuevo.porcentaje_asignado;
        
        const { montodescuento, apagar } = calcularValoresBeca(tipoId, porcentaje);
        nuevoState.nuevo.montodescuento = montodescuento;
        nuevoState.nuevo.apagar = apagar;
      }
      
      return nuevoState;
    });
  }, [calcularValoresBeca]);

  // Resetear alertas después de 5 segundos
  useEffect(() => {
    if (state.alert) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, alert: null }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state.alert]);

  // Cargar datos cuando cambia el año seleccionado
  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController.signal);
    
    return () => abortController.abort();
  }, [fetchData]);

  // Actualizar año en el formulario nuevo cuando cambia
  useEffect(() => {
    setState(prev => ({
      ...prev,
      nuevo: {
        ...prev.nuevo,
        agno: selectedYear
      }
    }));
  }, [selectedYear]);

  return {
    becas: state.becas,
    alumnos: state.alumnos,
    searchQuery: state.searchQuery,
    selectedAlumno: state.selectedAlumno,
    nuevo: state.nuevo,
    loading: state.loading,
    error: state.error,
    alert: state.alert,
    fetchData,
    searchAlumnos,
    setSelectedAlumno,
    handleSave,
    handleAdd,
    handleDelete,
    handleChange,
    setNuevo,
    calcularValoresBeca
  };
};
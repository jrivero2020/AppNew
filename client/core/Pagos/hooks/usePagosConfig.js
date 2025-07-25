import { useState, useCallback, useEffect, useContext } from 'react';
import { getPagosConfigMontos, UpsertPagosConfigMontos, DeletePagosConfigMontos } from '../../../docentes/api-docentes';
import { AuthContext } from "../../../core/AuthProvider";

export const usePagosConfig = () => {
  const { jwt } = useContext(AuthContext);
  const abortController = new AbortController();  
  
  // Estado inicial
  const [state, setState] = useState({
    montos: [],
    nuevo: { agno: '', monto: '' },
    loading: false,
    error: null,
    alert: null
  });

  // Función para cargar datos
  const fetchData = useCallback(async () => {
    const signal = abortController.signal;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await getPagosConfigMontos({ t: jwt.token }, signal);
      if (data.error) throw new Error(data.message);
      
      setState(prev => ({
        ...prev,
        montos: Object.values(data),
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt.token]);

  // Función para guardar (crear/actualizar)
  const handleSave = useCallback(async (item) => {
    try {
      // Validaciones
      if (!item.agno || !item.monto) {
        throw new Error('Año y monto son requeridos');
      }
      if (item.monto <= 40000) {
        throw new Error('El monto debe ser mayor a 40,000');
      }

      const result = await UpsertPagosConfigMontos(item, { t: jwt.token });
      if (result.error) throw new Error(result.message);
      
      await fetchData();
      return { success: true, message: 'Guardado correctamente' };
    } catch (error) {
      return { success: false, message: error.message || 'Error al guardar' };
    }
  }, [jwt.token, fetchData]);

  // Función para agregar nuevo
  const handleAdd = useCallback(async () => {
    if (!state.nuevo.agno || !state.nuevo.monto) {
      return { success: false, message: 'Año y monto son requeridos' };
    }

    const result = await handleSave(state.nuevo);
    
    if (result.success) {
      // Limpiar formulario
      setState(prev => ({
        ...prev,
        nuevo: { agno: '', monto: '' }
      }));
    }
    
    return result;
  }, [state.nuevo, handleSave]);

  // FUNCIÓN DE ELIMINACIÓN COMPLETA
  const handleDelete = useCallback(async (id) => {
    try {
      if (!id) throw new Error('ID no válido para eliminar');
      
      // Llamada a la API para eliminar
      const result = await DeletePagosConfigMontos(id, { t: jwt.token });
      
      if (result.error) throw new Error(result.message);
      
      // Actualizar estado después de eliminar
      setState(prev => ({
        ...prev,
        montos: prev.montos.filter(item => item.id !== id),
        alert: { type: 'success', message: 'Eliminado correctamente' }
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

  // Función para actualizar campos
  const handleChange = useCallback((index, key, value) => {
    setState(prev => {
      const updated = [...prev.montos];
      updated[index][key] = key === 'agno' ? parseInt(value) || 0 : 
                          key === 'monto' ? parseFloat(value) || 0 : 
                          value;
      return { ...prev, montos: updated };
    });
  }, []);

  // Función para actualizar el formulario de nuevo
  const setNuevo = useCallback((nuevo) => {
    setState(prev => ({ ...prev, nuevo }));
  }, []);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const abortController = new AbortController();
    fetchData(abortController.signal);
    
    return () => abortController.abort();
  }, [fetchData]);

  // Retornamos todo lo necesario
  return {
    montos: state.montos,
    nuevo: state.nuevo,
    loading: state.loading,
    error: state.error,
    alert: state.alert,
    fetchData,
    handleSave,
    handleAdd,
    handleDelete,
    handleChange,
    setNuevo
  };
};
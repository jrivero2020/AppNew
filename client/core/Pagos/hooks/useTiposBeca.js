import { useState, useEffect, useCallback, useContext } from 'react';
import { getTiposBeca, UpsertTipoBeca, DeleteTipoBeca } from '../../../docentes/api-docentes';
import { AuthContext } from "../../../core/AuthProvider";

export const useTiposBeca = ( selectedYear, montoConfig) => {
  const { jwt } = useContext(AuthContext);
  const abortController = new AbortController();  

  // Estado inicial
  const [state, setState] = useState({
    tipos: [],
    nuevo: {
      nombre: '',
      descripcion: '',
      porcentaje_fijo: null,
      agno: selectedYear,
      descuento: null,
      monto: null
    },
    loading: false,
    error: null,
    alert: null
  });

  // Función para calcular descuento y monto final
  const calcularValores = useCallback((porcentaje) => {
    if (!porcentaje || !montoConfig) return { descuento: null, monto: null };
    
    const descuento = montoConfig * (porcentaje / 100);
    return {
      descuento: Math.ceil(descuento),
      monto: Math.ceil(montoConfig - descuento)
    };
  }, [montoConfig]);

  // Cargar tipos de beca
  const fetchData = useCallback(async () => {
    const signal = abortController.signal;
    if (!selectedYear) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await getTiposBeca({ t: jwt.token, agno: selectedYear }, signal);
      if (data.error) throw new Error(data.message);
      
      // Calcular valores para cada tipo
      const tiposConCalculos = data.map(tipo => ({
        ...tipo,
        ...calcularValores(tipo.porcentaje_fijo)
      }));
      
      setState(prev => ({
        ...prev,
        tipos: tiposConCalculos,
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
  }, [jwt.token, selectedYear, calcularValores]);

  // Guardar o actualizar tipo de beca
  const handleSave = useCallback(async (item) => {
    try {
      // Validaciones
      if (!item.nombre) throw new Error('El nombre es requerido');
      if (!item.agno) throw new Error('El año es requerido');
      
      // Validar nombre único por año
      const nombreExiste = state.tipos.some(t => 
        t.id !== item.id && 
        t.nombre === item.nombre && 
        t.agno === item.agno
      );
      if (nombreExiste) throw new Error('Ya existe un tipo de beca con este nombre para el año seleccionado');
      
      // Validar porcentaje si es beca fija
      if (item.porcentaje_fijo !== null) {
        if (item.porcentaje_fijo <= 0 || item.porcentaje_fijo > 100) {
          throw new Error('El porcentaje debe estar entre 0.1 y 100');
        }
      }

      // Calcular valores antes de guardar
      const { descuento, monto } = calcularValores(item.porcentaje_fijo);
      const itemToSave = {
        ...item,
        descuento,
        monto
      };

      const result = await UpsertTipoBeca(itemToSave, { t: jwt.token });
      if (result.error) throw new Error(result.message);
      
      await fetchData();
      return { 
        success: true, 
        message: item.id ? 'Tipo de beca actualizado' : 'Tipo de beca creado'
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Error al guardar el tipo de beca' 
      };
    }
  }, [jwt.token, state.tipos, fetchData, calcularValores]);

  // Agregar nuevo tipo de beca
  const handleAdd = useCallback(async () => {
    const result = await handleSave(state.nuevo);
    
    if (result.success) {
      // Resetear formulario
      setState(prev => ({
        ...prev,
        nuevo: {
          nombre: '',
          descripcion: '',
          porcentaje_fijo: null,
          agno: selectedYear,
          descuento: null,
          monto: null
        },
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

  // Eliminar tipo de beca
  const handleDelete = useCallback(async (id) => {
    try {
      if (!id) throw new Error('ID no válido');
      
      const result = await DeleteTipoBeca(id, { t: jwt.token });
      if (result.error) throw new Error(result.message);
      
      // Actualización optimista
      setState(prev => ({
        ...prev,
        tipos: prev.tipos.filter(tipo => tipo.id !== id),
        alert: { type: 'success', message: 'Tipo de beca eliminado' }
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

  // Actualizar campo en tipo existente
  const handleChange = useCallback((index, key, value) => {
    setState(prev => {
      const updated = [...prev.tipos];
      
      // Conversión de tipos
      const parsedValue = key === 'porcentaje_fijo' ? 
        (value ? parseFloat(value) : null) :
        value;
      
      updated[index][key] = parsedValue;
      
      // Recalcular si cambió el porcentaje
      if (key === 'porcentaje_fijo') {
        const { descuento, monto } = calcularValores(parsedValue);
        updated[index].descuento = descuento;
        updated[index].monto = monto;
      }
      
      return { ...prev, tipos: updated };
    });
  }, [calcularValores]);

  // Actualizar formulario de nuevo tipo
  const setNuevo = useCallback((nuevo) => {
    setState(prev => ({ 
      ...prev, 
      nuevo: {
        ...nuevo,
        // Recalcular si cambió el porcentaje
        ...(nuevo.porcentaje_fijo !== undefined ? 
          calcularValores(nuevo.porcentaje_fijo) : {})
      }
    }));
  }, [calcularValores]);

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
    fetchData();
    
    return () => abortController.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    tipos: state.tipos,
    nuevo: state.nuevo,
    loading: state.loading,
    error: state.error,
    alert: state.alert,
    fetchData,
    handleSave,
    handleAdd,
    handleDelete,
    handleChange,
    setNuevo,
    calcularValores
  };
};
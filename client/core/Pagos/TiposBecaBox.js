import React from 'react';
import { useTiposBeca } from './hooks/useTiposBeca';
import TiposBecaUI from './ui/TiposBecaUI';
import { useDashboard } from './context/dashboardContext'; // Importación corregida

const TiposBecaBox = () => {
  const { selectedYear, montoConfig } = useDashboard();
  const {
    tipos,
    nuevo,
    loading,
    handleSave,
    handleAdd,
    handleDelete,
    handleChange,
    setNuevo,
    calcularValores
  } = useTiposBeca(selectedYear, montoConfig);

  return (
    <TiposBecaUI
      tipos={tipos}
      nuevo={nuevo}
      loading={loading}
      selectedYear={selectedYear}
      montoConfig={montoConfig}
      onSave={handleSave}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onChange={handleChange}
      onNuevoChange={setNuevo}
      calcularValores={calcularValores}
    />
  );
};

export default TiposBecaBox;
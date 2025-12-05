import React from 'react';
import { usePagosConfig } from './hooks/usePagosConfig';
import { useDashboard } from './context/dashboardContext';
import ConfigMontoUI from './ui/ConfigMontoUI';

const PagosConfigMontoBox = ({jwt}) => {
  const { handleYearChange } = useDashboard();
  const { montos, nuevo, loading, handleSave, handleAdd, handleDelete, handleChange, setNuevo } = usePagosConfig();

  return (
    <ConfigMontoUI
      montos={montos}
      nuevo={nuevo}
      loading={loading}
      onSave={handleSave}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onChange={handleChange}
      onNuevoChange={setNuevo}
      onYearSelect={handleYearChange}
      jwt={jwt}
    />
  );
};

export default PagosConfigMontoBox;
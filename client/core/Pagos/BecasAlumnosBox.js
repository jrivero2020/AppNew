import React from 'react';
import useBecasAlumnos from './hooks/useBecasAlumnos.js';
import BecasAlumnosUI from './ui/BecasAlumnosUI';
import { useDashboard } from './context/dashboardContext'


const BecasAlumnosBox = () => {
  const { selectedYear, montoConfig } = useDashboard();
  const {
    becas,
    alumnos,
    searchQuery,
    selectedAlumno,
    nuevo,
    loading,
    onSearch,
    onSelectAlumno,
    onSave,
    onAdd,
    onDelete,
    onChange,
    onNuevoChange,
    calcularValoresBeca
  } = useBecasAlumnos(selectedYear, montoConfig);

  return (
    <BecasAlumnosUI
      becas={becas}
      alumnos={alumnos}
      searchQuery={searchQuery}
      selectedAlumno={selectedAlumno}
      nuevo={nuevo}
      loading={loading}
      selectedYear={selectedYear}
      montoConfig={montoConfig}
      onSearch={onSearch}
      onSelectAlumno={onSelectAlumno}
      onSave={onSave}
      onAdd={onAdd}
      onDelete={onDelete}
      onChange={onChange}
      onNuevoChange={onNuevoChange}
      calcularValoresBeca={calcularValoresBeca}
    />
  );
};

export default BecasAlumnosBox;
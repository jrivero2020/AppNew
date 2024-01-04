
import React, { useState } from "react";

function Hijo(props) {
    const { objeto, actualizarObjeto } = props;
  
    const modificarObjeto = () => {
      const nuevoObjeto = { ...objeto };
      nuevoObjeto.edad += 1;
      actualizarObjeto(nuevoObjeto);
    };
  
    return (
      <div>
        <p>Objeto en Hijo: {JSON.stringify(objeto)}</p>
        <button onClick={modificarObjeto}>Modificar Objeto</button>
      </div>
    );
  }
  
  export default Hijo;
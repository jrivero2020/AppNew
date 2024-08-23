import React, { useEffect, useState } from 'react'
import { api_GetJsonInitOpcion} from "./../docentes/api-docentes";
  
export default function VerJSON() {
    const [data, setData] = useState([]);
    const [showOpc, setShowOpc] = useState(false);

    useEffect(() => {
        api_GetJsonInitOpcion().then((data) => {
            if (data && data.error) {
              return false;
            } else {
              const results = Object.values(data[0]); 
              if (
                results === undefined ||
                results === null ||
                Object.keys(results).length === 0

              ) {
                alert(
                  "**ATENCION** no encuentro JSON inicial"
                );
              } else {
                setData(results);
                setShowOpc(true);
              }
            }
          });
        }, []);
  
    return (
      <div>
      
        { showOpc && data.map((item) => (
          <div style={{ marginTop: "90px" }} key={item.datos.id}>
            <p>{item.datos.titulo}</p>
            {/* Renderiza otros campos aquí */}
          </div>
        ))}
        { !showOpc && (
          <div > No hay datos</div>
        )}
      </div>
    );
  }
  


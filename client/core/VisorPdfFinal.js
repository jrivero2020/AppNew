import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import es_ES from "@react-pdf-viewer/locales/lib/es_ES.json";

import "./../../client/assets/css/dlCore_index.css";
import "./../../client/assets/css/dlStyles_index.css";

// import '@react-pdf-viewer/print/lib/styles/index.css';

const WorkerMinJs = "dist/pdf.worker.min.js";

function VisorPdf(props) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarToggle: false, // Ocultar el panel lateral
    scrollMode: "both", // Establecer el modo de desplazamiento tanto horizontal como vertical
    zoom: {
      defaultZoom: "page-width",
      minZoom: 0.5, // Limitar el zoom mínimo
      maxZoom: 3.0, // Limitar el zoom máximo
    },
  });

  const handleLinkClick = (e) => {
    const target = e.target;

    // Verifica si el clic fue en un enlace
    if (target.tagName === "A" && target.href) {
      e.preventDefault();
      window.open(target.href, "_blank");
    }
  };

  return (
    <Worker workerUrl={WorkerMinJs}>
      <div
        onClick={handleLinkClick}
        style={{
          width: "100%", // El contenedor ocupa todo el ancho disponible
          height: "100%", // El contenedor ocupa todo el alto disponible
          overflow: "auto", // Permite desplazamiento tanto vertical como horizontal
          display: "flex", // Asegura que el contenedor del pdf ocupe todo el espacio disponible
          justifyContent: "center", // Centra el contenido horizontalmente
        }}
      >
        <Viewer
          fileUrl={props.ArchivoUrl}
          localization={es_ES}
          plugins={[defaultLayoutPluginInstance]}
          initialPage={0}
          renderMode="canvas" // Usar canvas para mejorar el rendimiento
          style={{
            width: "100%", // Asegura que el pdf ocupe todo el ancho
            height: "100%", // Asegura que el pdf ocupe todo el alto
            overflow: "auto", // Permite el desplazamiento dentro del PDF
          }}
        />
      </div>
    </Worker>
  );
}
export default VisorPdf;

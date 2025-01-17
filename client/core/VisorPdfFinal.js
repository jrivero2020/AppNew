import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

import "./../../client/assets/css/dlCore_index.css";
import "./../../client/assets/css/dlStyles_index.css";

// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
const WorkerMinJs = "dist/pdf.worker.min.js";

function VisorPdf(props) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handleLinkClick = (e) => {
    const target = e.target;

    // Verifica si el clic fue en un enlace
    if (target.tagName === "A" && target.href) {
      e.preventDefault();

      // console.log(`Enlace prevenido: ${target.href}`);
      window.open(target.href, "_blank");
    }
  };

  return (
    <div onClick={handleLinkClick} style={{ height: "920px" }}>
      <Worker workerUrl={WorkerMinJs}>
        <Viewer
          fileUrl={props.ArchivoUrl}
          plugins={[defaultLayoutPluginInstance]}
          initialPage={0}
        />
      </Worker>
    </div>
  );
}
export default VisorPdf;

import React                   from 'react';
import { Worker, Viewer }      from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import './../../client/assets/css/dlCore_index.css'
import './../../client/assets/css/dlStyles_index.css'

const WorkerMinJs = "dist/pdfworkermin.js"

function VisorPdf(props) {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <Worker workerUrl={WorkerMinJs}>
      <Viewer fileUrl={props.ArchivoUrl} plugins={[defaultLayoutPluginInstance]} initialPage={0} />
    </Worker>

  );
}
export default VisorPdf



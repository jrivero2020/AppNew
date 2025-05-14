import React, { useState, useEffect } from 'react';

const SimceBasica = () => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    // Carga el HTML estático desde /public
    console.log("Cargue SimceBasica")
    fetch('dist/Simce/simce1.html')
      .then((response) => response.text())
      .then((html) => setHtmlContent(html))
      .catch((error) => {
        console.error("Error al cargar simce1.html:", error);
        setHtmlContent("<p>Error al cargar las pruebas. Recarga la página.</p>");
      });
  }, []);

  useEffect(() => {
  const handleClick = (event) => {
    const button = event.target.closest('.btn');
    if (!button) return;

    const url = button.getAttribute('data-href');
    if (url) window.open(url, '_blank');
  };

  document.addEventListener('click', handleClick);
  return () => document.removeEventListener('click', handleClick);
}, []);

  return (
    <div style={{ paddingTop: "99px" }}
      className="simce-html-container" 
      dangerouslySetInnerHTML={{ __html: htmlContent }} 
    />
  );
};

export default SimceBasica;
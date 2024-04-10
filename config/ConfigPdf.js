import auth from "./../client/auth/auth-helper";

const jwt = auth.isAuthenticated();
const jwtRol = jwt ? jwt.user._rol : 0;

const archivoPdf = [
  {
    id: 1,
    archivo: "dist/Pdf/inicio-escolar-2023.pdf",
    titulo: "Inicio año escolar 2023",
  },
  {
    id: 2,
    archivo: "dist/Pdf/Cuenta-Publica-2023.pdf",
    titulo: "Cuenta pública año 2023",
  },
  {
    id: 3,
    archivo: "dist/Pdf/Manual_Convivencia2023.pdf",
    titulo: "Manual de Convivencia Escolar año 2023",
  },
  {
    id: 4,
    archivo: "dist/Pdf/utilespk_2024.pdf",
    titulo: "",
  },
  {
    id: 5,
    archivo: "dist/Pdf/utilesK_2024.pdf",
    titulo: "",
  },
  {
    id: 6,
    archivo: "dist/Pdf/utilesba_2024.pdf",
    titulo: "",
  },
  {
    id: 7,
    archivo: "dist/Pdf/calendarioescolar2024.pdf",
    titulo: "Calendario Escolar año 2024",
  },
];

const imgLinks = [
  {
    id: 0,
    foto: "bienvenidos.jpg",
    titulo: "bienvenidos",
    llamada: { componente: "/MiddlewarePdf", param: { ptr: 1 } },
    activo: 1,
  },
  {
    id: 1,
    foto: "FondoPantalla.jpg",
    titulo: "FondoPantalla",
    llamada: "",
    activo: 0,
  },
  {
    id: 2,
    foto: "cuentapublica.png",
    titulo: "cuentapublica",
    llamada: {
      componente: "/MiddlewarePdf",
      param: { ptr: 2 },
    },
    activo: 1,
  },
  {
    id: 3,
    foto: "ListaUtiles.png",
    titulo: "ListaUtiles",
    llamada: { componente: "/VerUtilesEscolares", param: {} },
    activo: 1,
  },
  {
    id: 4,
    foto: "ManualConvivencia.png",
    titulo: "ManualConvivencia",
    llamada: { componente: "/MiddlewarePdf", param: { ptr: 3 } },
    activo: 1,
  },
  {
    id: 5,
    foto: "CertificadoARegular.png",
    titulo: "CertificadoARegular",
    llamada: { componente: "/CertAlumnoRegular", param: {} },
    activo: jwtRol === 1 || jwtRol === 2 ? 1 : 0,
  },
  {
    id: 6,
    foto: "campana_vacuna.png",
    titulo: "campana_vacuna",
    llamada: { componente: "/Pendiente", param: {} },
    activo: 1,
  },
  {
    id: 7,
    foto: "reunionespa.png",
    titulo: "reunionespa",
    llamada: { componente: "/Pendiente", param: {} },
    activo: 1,
  },
  {
    id: 8,
    foto: "Jornada.png",
    titulo: "Jornada",
    llamada: { componente: "/Pendiente", param: {} },
    activo: 1,
  },
  {
    id: 9,
    foto: "Faldas.png",
    titulo: "Faldas",
    llamada: { componente: "/Pendiente", param: {} },
    activo: 1,
  },
  {
    id: 10,
    foto: "GaleriaFotos.png",
    titulo: "GaleriaFotos",
    llamada: {
      componente: "link",
      link: {
        url: "sites.google.com/conquistadores.red-lc.com/colegiolosconquistadores/quienes-somos",
      },
    },
    activo: 1,
  },
  {
    id: 11,
    foto: "tiendasm.png",
    titulo: "TiendaSm",
    llamada: "",
    activo: 0,
  },
  {
    id: 12,
    foto: "descuentodimeiggs.png",
    titulo: "DescuentosMeiggs",
    llamada: "",
    activo: 0,
  },
  {
    id: 13,
    foto: "calendarioescolar.png",
    titulo: "Calendario Escolar año 2024",
    llamada: { componente: "/MiddlewarePdf", param: { ptr: 7 } },
    activo: 1,
  },
];

const imgCarousel = [
  {
    id: 1,
    foto: "Entrada1.jpg",
    titulo: "Entrada",
  },
  {
    id: 2,
    foto: "Cancha1.jpg",
    titulo: "Cancha 1",
  },
  {
    id: 3,
    foto: "Pasillo.jpg",
    titulo: "pasillo 1",
  },
  {
    id: 4,
    foto: "pasillo2.jpg",
    titulo: "pasillo 2",
  },
  {
    id: 5,
    foto: "Patio_PK.jpg",
    titulo: "Patio_PK",
  },
  {
    id: 6,
    foto: "patiochico.jpg",
    titulo: "pasillo 2",
  },
  {
    id: 7,
    foto: "patiopeques.jpg",
    titulo: "pasillo 2",
  },
  {
    id: 8,
    foto: "salacompualumnos.jpg",
    titulo: "salacompualumnos",
  },
  {
    id: 9,
    foto: "Naranjos.jpg",
    titulo: "Naranjos",
  },
  {
    id: 10,
    foto: "ComedorPatio1.jpg",
    titulo: "ComedorPatio",
  },
  { id: 11, foto: "actos1.jpg", titulo: "actos1" },
  { id: 12, foto: "actos2.jpg", titulo: "actos2" },
  { id: 13, foto: "aniversario1.jpg", titulo: "aniversario1    " },
  { id: 14, foto: "aniversario2.jpg", titulo: "aniversario2    " },
  { id: 15, foto: "arte1.jpg", titulo: "arte1" },
  { id: 16, foto: "arte2.jpg", titulo: "arte2" },
  { id: 17, foto: "arte3.jpg", titulo: "arte3" },
  { id: 18, foto: "arte4.jpg", titulo: "arte4" },
  { id: 19, foto: "edfisica1.jpg", titulo: "edfisica1" },
  { id: 20, foto: "edfisica2.jpg", titulo: "edfisica2" },
  { id: 21, foto: "edfisica3.jpg", titulo: "edfisica3" },
  { id: 22, foto: "generacion2022.jpg", titulo: "generacion2022" },
  { id: 23, foto: "kinderpatio.jpg", titulo: "kinderpatio" },
  { id: 24, foto: "kinderpatio1.jpg", titulo: "kinderpatio1" },
  { id: 25, foto: "salacompu.jpg", titulo: "salacompu" },
  { id: 26, foto: "SalaCompu1.jpg", titulo: "SalaCompu1" },
  { id: 27, foto: "", titulo: "" },
];

export { archivoPdf, imgLinks, imgCarousel };

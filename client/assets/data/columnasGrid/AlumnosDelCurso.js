
export const AlCursocolumns = [
  {
    field: "nroal",
    headerName: "Nº Lista",
    width: 80,
    height: 18,
    type: 'number',
    editable: true,
  },
  {
    field: "apat",
    headerName: "Ap. Paterno",
    width: 160,
    height: 18,
    editable: false,
  },
  {
    field: "amat",
    headerName: "Ap. Materno",
    width: 160,
    height: 18,
    editable: false,
  },
  {
    field: "nombres",
    headerName: "Nombres",
    width: 240,
    height: 18,
    editable: false,
  },
  {
    field: "rut",
    headerName: "Rut",
    width: 90,
    height: 18,
    editable: false,
  },
  {
    field: "dv",
    headerName: "dv",
    width: 1,
    height: 18,
    editable: false,
  },
  {
    field: "nro_matricula",
    headerName: "Nº Matr.",
    width: 90,
    headerAlign: 'center',
    height: 18,
    type: 'number',
    editable: true,
  },

  {
    field: "fecharetiro",
    headerName: "F.Retiro",
    width: 113,
    height: 18,
    type: 'date',
    editable: true,
    headerAlign: 'center',
    align: 'center',
    valueGetter: (params) => {
      // console.log( "Params en valueGetter :", params , "  params.value :", params.value)
      const dateValue = params ? new Date(params) : null;
      return dateValue;
    },
    renderCell: (params) => {
      const lafecha = new Date(1900, 0, 1, 0, 0, 0); // Año, Mes (0-11), Día, Hora, Minuto, Segundo
      const fechaNula = (  params.value.getFullYear() === lafecha.getFullYear()  && params.value.getMonth() === lafecha.getMonth())

      if (params === null || fechaNula ) {
        return "-"; // Mostrar nada si el valor es NULL
      } else {
        let lafecha = params.value        
        return String(lafecha.getDate()).padStart(2, '0') +'-' + String(lafecha.getMonth() + 1).padStart(2, '0') + "-" + lafecha.getFullYear() 

      }
    }
  },

  {
    field: "activo",
    headerName: "activo",
    width: 60,
    height: 18,
    type: 'boolean',
    editable: true,
  },
];

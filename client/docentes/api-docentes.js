const create = async (docente) => {
  try {
    let response = await fetch("/Docente/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(docente),
    });
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const inscribe = async (docente) => {
  try {
    let response = await fetch("/inscripcionDocente/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(docente),
    });
    let msgRet = await response.json();
    if (response.ok) {
      return msgRet;
    } else {
      throw new Error(msgRet.message);
    }
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const docenteListarHoras = async (opcion, signal) => {
  try {
    let response = await fetch("/docenteHorarios/" + opcion, {
      method: "GET",
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const leer = async (params, credential, signal) => {
  try {
    params.Authorization = "Baerer " + credential.t;
    let response = await fetch("/Docente/" + params.userId, {
      method: "GET",
      signal: signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Baerer " + credential.t,
      },
    });
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const update = async (params, credential, Docente) => {
  try {
    let response = await fetch("/Docente/" + params.userId, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Baerer " + credential.t,
      },
      body: JSON.stringify(Docente),
    });
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const remove = async (params, credential) => {
  try {
    let response = await fetch("/Docente/" + params.userId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Baerer " + credential.t,
      },
    });
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const getDatosCert = async (params, signal, credentials) => {
  // console.log('dentro de getDatosCert')
  try {
    let response = await fetch("/AlumnosByRut/" + params.rut, {
      method: "GET",
      signal: signal,
      headers: { Authorization: "Bearer " + credentials.t },
    });
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const api_ActAlumnoCurso = async (params, credentials, user) => {
  try {
    const rutAl = params.rutAl;
    let response = await fetch("/AlumnosByRut/" + rutAl, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify(user),
    });
    return await response.json();
  } catch (err) {
    return { error: 500, message: err.message };
  }
};

const getDatosMatricula = async (params, credentials, signal) => {
  try {
    let response = await fetch("/matricula/" + params, {
      method: "GET",
      signal: signal,
      headers: { Authorization: "Bearer " + credentials.t },
    });
    if (!response.ok) {
      return { error: response.status, message: response.statusText };
    }
    return await response.json();
  } catch (err) {
    return { error: 500, message: err.message };
  }
};

const getComunas = async () => {
  try {
    let response = await fetch("/getComunas", { method: "GET" });
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const getParentesco = async () => {
  try {
    let response = await fetch("/getParentesco", { method: "GET" });
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const getCursos = async () => {
  try {
    let response = await fetch("/getCursos", { method: "GET" });
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const getcsvLibroMatriculas = async (credentials, signal) => {
  try {
    let response = await fetch("/CsvLibroMatricula", {
      method: "GET",
      signal: signal,
      headers: { Authorization: "Bearer " + credentials.t },
    });
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const api_getAlumnosNombres = async (params, signal) => {
  try {
    let nomAl = params.al_nombres;
    let apPatAl = params.al_apat;
    let apMatAl = params.al_amat;

    nomAl = nomAl === "" ? "@" : nomAl;
    apPatAl = apPatAl === "" ? "@" : apPatAl;
    apMatAl = apMatAl === "" ? "@" : apMatAl;

    let response = await fetch(
      "/getAlumnoNombres/" + nomAl + "/" + apPatAl + "/" + apMatAl,
      {
        method: "GET",
        signal: signal,
      }
    );
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const api_CantAlumnosCurso = async (credentials, signal) => {
  try {
    let response = await fetch("/getCantAlumnosCurso", {
      method: "GET",
      signal: signal,
      headers: { Authorization: "Bearer " + credentials.t },
    });
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const api_NroMatriculas = async (credentials, signal) => {
  try {
    let response = await fetch("/getNroMatriculas", {
      method: "GET",
      signal: signal,
      headers: { Authorization: "Bearer " + credentials.t },
    });
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const api_GetAlumnosCurso = async (params, credentials, signal) => {
  try {
    const ense = params.ense;
    const grado = params.grado;
    const letra = params.letra;
    let response = await fetch(
      "/getAlumnosCurso/" + ense + "/" + grado + "/" + letra,
      {
        method: "GET",
        signal: signal,
        headers: { Authorization: "Bearer " + credentials.t },
      }
    );

    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const api_GetJsonInitOpcion = async (params, signal) => {
  try {
    let response = await fetch("/JsonInitOpcion", {
      method: "GET",
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

const api_CreaModificaAlumno = async (params, credentials, alumno) => {
  try {
    const al_rut = params.al_rut;
    const result = params.resul;

    let response = await fetch("/UpdateInsertAlumno/" + al_rut, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      body: JSON.stringify({ alumno, result }),
    });
    if (!response.ok) {
      // console.log("api_CreaModificaAlumno ===> !response.ok valor de response:==>", response );
      return { error: response.status, message: response.statusText };
    }
    return await response.json();
  } catch (err) {
    return { error: 500, message: err.message };
  }
};

const api_getDatosFamiliaAP = async (params, credentials, signal) => {
  try {
    let response = await fetch("/rutaGetDatosFamilia/" + params, {
      method: "GET",
      signal: signal,
      headers: { Authorization: "Bearer " + credentials.t },
    });
    if (!response.ok) {
      return { error: response.status, message: response.statusText };
    }
    return await response.json();
  } catch (err) {
    return { error: 500, message: err.message };
  }
};

const api_getApoderadoNombres = async (params, signal) => {
  try {
    let nomAp = params.nombres;
    let apPatAp = params.apat;
    let apMatAp = params.amat;

    nomAp = !nomAp ? "@" : nomAp;
    apPatAp = !apPatAp ? "@" : apPatAp;
    apMatAp = !apMatAp ? "@" : apMatAp;

    let response = await fetch(
      "/rutaGetApoderadoNombres/" + nomAp + "/" + apPatAp + "/" + apMatAp,
      {
        method: "GET",
        signal: signal,
      }
    );
    return await response.json();
  } catch (err) {
    return { error: err.message, message: err.message };
  }
};

export {
  create,
  leer,
  update,
  remove,
  inscribe,
  docenteListarHoras,
  getDatosCert,
  getDatosMatricula,
  getComunas,
  getParentesco,
  getCursos,
  api_getAlumnosNombres,
  getcsvLibroMatriculas,
  api_CantAlumnosCurso,
  api_NroMatriculas,
  api_GetAlumnosCurso,
  api_GetJsonInitOpcion,
  api_ActAlumnoCurso,
  api_CreaModificaAlumno,
  api_getDatosFamiliaAP,
  api_getApoderadoNombres,
};

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
  } catch (error) {
    console.log(error);
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
    // console.log("en api-docente, docenteListarHora. opcion", opcion);
    let response = await fetch("/docenteHorarios/" + opcion, {
      method: "GET",
      signal: signal,
    });
    return await response.json();
  } catch (error) {
    console.log("Este error me arroja ===>", error);
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
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
  }
};

const getDatosCert = async (params, signal) => {
  try {
    let response = await fetch("/listaAlumnosByRut/" + params.rut, {
      method: "GET",
      signal: signal,
    });
    return await response.json();
  } catch (error) {
    console.log("Este error me arroja ===>", error);
  }
};
const getDatosMatricula = async (params, signal) => {
  // console.log("en api-docente, getDatosMatricula. opcion",params,"   Rut=>",params.al_rut);
  try {
    let response = await fetch("/matricula/" + params.al_rut, {
      method: "GET",
      signal: signal,
    });
    return await response.json();
  } catch (error) {
    console.log("Este error me arroja ===>", error);
  }
};

const getComunas = async () => {
  try {
    let response = await fetch("/getComunas", { method: "GET" });
    return await response.json();
  } catch (error) {
    console.log("**error Comunas *** ===>", error);
  }
};

const getParentesco = async () => {
  try {
    let response = await fetch("/getParentesco", { method: "GET" });
    return await response.json();
  } catch (error) {
    console.log("**error Parentesco *** ===>", error);
  }
};

const api_getAlumnosNombres = async (params, signal) => {
  try {
    // console.log("api_getAlumnosNombres parametro recibido: ", params);

    let nomAl = params.al_nombres;
    let apPatAl = params.al_apat;
    let apMatAl = params.al_amat;

    nomAl = nomAl === "" ? "@" : nomAl;
    apPatAl = apPatAl === "" ? "@" : apPatAl;
    apMatAl = apMatAl === "" ? "@" : apMatAl;

    // console.log(      "api_getAlumnosNombres /n /getAlumnoNombres/",      nomAl,      "/",      apPatAl,      "/",      apMatAl    );

    let response = await fetch(
      "/getAlumnoNombres/" + nomAl + "/" + apPatAl + "/" + apMatAl,
      {
        method: "GET",
        signal: signal,
      }
    );
    return await response.json();
  } catch (error) {
    console.log("**error Datos alumnos por nombre *** ===>", error);
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
  api_getAlumnosNombres,
};

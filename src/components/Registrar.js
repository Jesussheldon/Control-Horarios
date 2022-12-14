import { useAuth } from "../context/authContext";
import Sidebar from "./Sidebar";
import { getDatabase, ref, set, get, child, off } from "firebase/database";
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";

export function Registrar() {

  const { loading } = useAuth()
  const [nombres, setNombres] = useState("")
  const [apellidos, setApellidos] = useState("")
  const [turno, setTurno] = useState("")
  const [camilleros, setCamilleros] = useState([])
  const [formulario, setFormulario] = useState(false)

  useEffect(() => {
    obtenerCamilleros();
  }, [])

   const borrarCamillero = (idCamillero) => {
    const db = getDatabase();

    set(ref(db, 'usuarios/' + idCamillero), null).then(_ => {
      obtenerCamilleros()
    });
  }
  
  const registrarCamillero = () => {
    const db = getDatabase();
    const idCamillero = generateString(16)

    set(ref(db, 'usuarios/' + idCamillero), {
      id: idCamillero,
      nombre: apellidos.toUpperCase() + " " + nombres.toUpperCase(),
      turno: turno
    }).then(_=>{
      setNombres("")
      setApellidos("")
      obtenerCamilleros()
      Swal.fire("Registro", "Camillero registrado exitosamente", "success")
    });
  }

  const obtenerCamilleros = () => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `usuarios`)).then((snapshot) => {
      if (snapshot.exists()) {
        let listaCamilleros = []
        for (const [_key, value] of Object.entries(snapshot.val())) {
          listaCamilleros.push(value)
        }
        setCamilleros(listaCamilleros)
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  const handleApellidos = (e) => {
    setApellidos(e.target.value)
  }

  const handleNombres = (e) => {
    setNombres(e.target.value)
  }

  const handleTurno = (e) => {
    setTurno(e.target.value)
  }

  const generateString = (length) => {
    let result = ' ';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  if (loading) {
    return (<h1>loading</h1>);
  }

  return <div>
    <Sidebar menu={3} />

    <div className="container">
      <button data-bs-toggle="tooltip" data-bs-placement="top" onClick={() => { setFormulario(true) }} data-bs-title="Registrar Camillero" id="btAgregar" type="button" className="btn btn-primary"><i className="bi bi-person-add"></i></button>

      {formulario === false && <div className="table-responsive pt-3">
        <table className="table table-light">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nombre</th>
              <th scope="col">Turno</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {camilleros.map((camillero, index) =>
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{camillero.nombre}</td>
                <td>{camillero.turno}</td>
                <td><button type="submit" onClick={() => {borrarCamillero(camillero.id)}} className="btn btn-danger ">Borrar</button></td>
              </tr>)}
          </tbody>
        </table>
      </div>}

      {formulario && <div id="formularioregistrar" className="border border-dark rounded bg-white p-3">

        <div className="mb-3">
          <p className="display-6 text-center">Nuevo camillero</p>
        </div>
        <div className="mb-3">
          <label className="form-label">Nombres</label>
          <input type="text" name="apellido" value={nombres} onChange={handleNombres} className="form-control" placeholder="Ejemplo: Carlos Ivan" />
        </div>
        <div className="mb-3">
          <label className="form-label">Apellidos</label>
          <input type="text" name="apellido" value={apellidos} onChange={handleApellidos} className="form-control" placeholder="Ejemplo: Lopez Millan" />
        </div>
        <div className="mb-3">
          <label className="form-label">Turno</label>
          <select className="form-control" onChange={handleTurno} id="turno">
            <option value="">Seleccione un turno</option>
            <option value="MATUTINO">Matutino</option>
            <option value="VESPERTINO">Vespertino</option>
            <option value="JORNADA COMPLETA">Jornada Completa</option>
          </select>
        </div>
        <div className="container text-center">
          <button type="submit" onClick={registrarCamillero} className="btn btn-primary mx-1">Registrar</button>
          <button type="submit" onClick={() => { setFormulario(false) }} className="btn btn-secondary">Cerrar</button>
        </div>
      </div>}
    </div>
  </div>;
}
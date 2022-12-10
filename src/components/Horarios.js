import { useAuth } from "../context/authContext";
import Sidebar from "./Sidebar";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { app } from "../firebase";
import { getDatabase, ref, set, get, child, off } from "firebase/database";



export function Horarios() {

  const { user, loading } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [camilleros, setCamilleros] = useState([]);
  const [opciones, setOpciones] = useState("");
  const [horarios, setHorarios] = useState([]);

  useEffect(() => {
    setEventos([
      `<option value="VACACIONES">VACACIONES</option>`,
      `<option value="CONGRESOS">CONGRESOS</option>`,
      `<option value="INCAPACIDADES">INCAPACIDADES</option>`,
      `<option value="PERMISOS">PERMISOS</option>`,
      `<option value="SEMANA DE RIESGO">SEMANA DE RIESGO</option>`
    ])
    obtenerHorarios()
    obtenerCamilleros()
  }, [])

  const writeUserData = (nombre, turno) => {
    const db = getDatabase();
    const userId = generateString(16)
    set(ref(db, 'usuarios/' + userId), {
      id: userId,
      nombre: nombre,
      turno: turno
    });
  }
  const guardarEvento = (idCamillero, evento, fecha) => {
    const db = getDatabase();
    const idEvento = generateString(16)

    get(child(ref(getDatabase()), `usuarios/` + idCamillero)).then((snapshot) => {
      if (snapshot.exists()) {
        const camillero = snapshot.val()
        set(ref(db, 'horarios/' + idEvento), {
          camillero: {
            id: camillero.id,
            nombre: camillero.nombre,
            turno: camillero.turno
          },
          fecha: fecha,
          evento: evento
        });
        obtenerHorarios()
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  const obtenerHorarios = () => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `horarios`)).then((snapshot) => {
      if (snapshot.exists()) {
        let listaHorarios = []
        for (const [_key, value] of Object.entries(snapshot.val())) {
          listaHorarios.push({
            start: moment(value.fecha).toDate(),
            end: moment(value.fecha).add(1, "days").toDate(),
            title: value.camillero.nombre + "<br/>" + value.evento
          })
        }
        setHorarios(listaHorarios)
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
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

  const obtenerCamilleros = () => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `usuarios`)).then((snapshot) => {
      if (snapshot.exists()) {
        let listaCamilleros = []
        let listaOpciones = ""
        for (const [_key, value] of Object.entries(snapshot.val())) {
          listaCamilleros.push(value)
          listaOpciones += `<option value="${value.id}">${value.nombre}</option>`
        }
        setOpciones(listaOpciones)
        setCamilleros(listaCamilleros)
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  const agregarEvento = async () => {

    const { value: valores } = await Swal.fire({
      title: 'Multiple inputs',
      html:
        `<select id="swal-input1"><option selected>seleccione uno</option>${opciones}</select>` +
        `<select id="swal-input2"><option selected>seleccione uno</option>${eventos}</select>` +
        '<input id="swal-input3" type="date" placeholder="Fecha" class="swal2-input">',
      focusConfirm: true,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value
        ]
      }
    })

    if (valores) {
      guardarEvento(valores[0], valores[1], valores[2])
    }
  }

  if (loading) return <h1>loading</h1>

  const localizer = momentLocalizer(moment);


  return <div>
    <Sidebar menu={2} />

    <div className="container">
      <h1>Horarios {user.email}</h1>
      <button onClick={agregarEvento} id="btAgregar" type="button" className="btn btn-primary"><i className="bi bi-patch-plus-fill"></i></button>
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={horarios}
        style={{ height: "100vh" }}
      />

    </div>

  </div>;
}
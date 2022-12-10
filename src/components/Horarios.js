import { useAuth } from "../context/authContext";
import Sidebar from "./Sidebar";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { app } from "../firebase";
import { getDatabase, ref, set, get, child, off } from "firebase/database";
import * as htmlToImage from 'html-to-image';
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import es from 'date-fns/locale/es'



export function Horarios() {

  const { user, loading } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [camilleros, setCamilleros] = useState([]);
  const [opciones, setOpciones] = useState("");
  const [horarios, setHorarios] = useState([]);
  let ready = false

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
    eventoColor()
  })

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
    get(child(dbRef, `horarios`)).then(async (snapshot) => {
      if (snapshot.exists()) {
        let listaHorarios = []
        for (const [_key, value] of Object.entries(snapshot.val())) {
          listaHorarios.push({
            start: moment(value.fecha).toDate(),
            end: moment(value.fecha).add(1, "days").toDate(),
            title: value.camillero.nombre + " (" + value.evento + ")"
          })
        }
        await setHorarios(listaHorarios)
        eventoColor()
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

  const eventoColor = () => {
    const els = document.getElementsByClassName("rbc-event");
    const searchValue1 = "(VACACIONES)";
    const searchValue2 = "(CONGRESOS)";
    const searchValue3 = "(INCAPACIDADES)";
    const searchValue4 = "(PERMISOS)";
    const searchValue5 = "(SEMANA DE RIESGO)";

    for (let i = 0; i < els.length; i++) {
      if (els[i].innerHTML.indexOf(searchValue1) > -1) {
        els[i].style.background = "red"
      } else if (els[i].innerHTML.indexOf(searchValue2) > -1) {
        els[i].style.background = "green"
      } else if (els[i].innerHTML.indexOf(searchValue3) > -1) {
        els[i].style.background = "purple"
      } else if (els[i].innerHTML.indexOf(searchValue4) > -1) {
        els[i].style.background = "orange"
      } else if (els[i].innerHTML.indexOf(searchValue5) > -1) {
        els[i].style.background = "steelblue"
      }
    }
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
      title: 'Nuevo Registro',
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

  const imprimirHorarios = () => {
    htmlToImage.toSvg(document.querySelector('#calendario'), { quality: 0.5 }).then(function (dataUrl) {
      var link = document.createElement('a');
      link.download = 'Horario ' + new Date().toDateString() + '.svg';
      link.href = dataUrl;
      link.click();
    });
  }

  if (loading) return <h1>loading</h1>

  const locales = {
    'en-US': es,
  }
  
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  })


  return <div>
    <Sidebar menu={2} />

    <div className="container">
      <button data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Registrar" onClick={agregarEvento} id="btAgregar" type="button" className="btn btn-primary"><i className="bi bi-patch-plus-fill"></i></button>
      <button data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Imprimir" onClick={imprimirHorarios} id="btImprimir" type="button" className="btn btn-secondary"><i class="bi bi-printer-fill"></i></button>
      <div id="calendario">
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView="month"
        events={horarios}
        style={{ height: "100vh" }}
      />
      </div>

    </div>

  </div>;
}
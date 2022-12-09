import { useAuth } from "../context/authContext";
import Sidebar from "./Sidebar";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { app } from "../firebase";
import { getDatabase, ref, set, get, child } from "firebase/database";



export function Horarios() {

  const { user, loading } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [camilleros, setCamilleros] = useState([]);

  useEffect(() => {
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
  const guardarEvento = (evento, fecha) => {
    const db = getDatabase();
    const id = generateString(16)
    set(ref(db, 'horarios/' + id), {
      usuario: generateString(16),
      fecha: fecha,
      evento: evento
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
        console.log(snapshot.val());
        setCamilleros(snapshot.val())
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  const agregarEvento = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Multiple inputs',
      html:
        '<select id="swal-input1"><option selected>seleccione uno</option><option value="{"Id": "1238","Nombre": "GRIJALVA CAMACHO JESUS","Turno": "MATUTINO"}">sheldon yoque se</option></select>' +
        '<select id="swal-input2"><option selected>seleccione uno</option><option value="0">vacaciones</option></select>' +
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
    if (formValues) {
      Swal.fire(JSON.stringify(formValues))
      const listaEventos = [
        "Vacaciones"
      ]
      setEventos([
        {
          start: moment(formValues[2]).toDate(),
          end: moment(formValues[2])
            .add(1, "days")
            .toDate(),
          title: listaEventos[formValues[1]]
        }
      ])
      guardarEvento(listaEventos[formValues[1]], formValues[2])
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
        events={eventos}
        style={{ height: "100vh" }}
      />

    </div>

  </div>;
}
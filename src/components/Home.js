import { useAuth } from "../context/authContext";
import Sidebar from "./Sidebar";

export function Home() {

  const { user, loading } = useAuth()

  if (loading) return <h1>loading</h1>

  return <div>
    <Sidebar menu={1} />

    <div className="container">
      <div id="home">
        <div className="text-center" id="presentacion">
          <p className="display-2">Bienvenido</p>
          <p className="display-2">Control Horarios</p>
        </div>
      </div>
      <h1>Bienvenido {user.email}</h1>


    </div>

  </div>;
}

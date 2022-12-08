import { useAuth } from "../context/authContext";
import Sidebar from "./Sidebar";

export function Imprimir() {

  const { user, loading } = useAuth()

  if (loading) return <h1>loading</h1>

  return <div>
    <Sidebar menu={3} />

    <div className="container">
      <h1> Imprimir {user.email}</h1>


    </div>

  </div>;
}
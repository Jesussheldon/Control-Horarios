import { useAuth } from "../context/authContext";
import Sidebar from "./Sidebar";

export function Horarios() {

  const { user, loading } = useAuth()

  if (loading) return <h1>loading</h1>

  return <div>
    <Sidebar menu={2} />

    <div className="container">
      <h1>Horarios {user.email}</h1>


    </div>

  </div>;
}
import { Routes,Route } from'react-router-dom';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Register } from './components/Register';
import { AuthProvider } from "./context/authContext";
import "./App.css";
import { Horarios } from './components/Horarios';
import { Registrar } from './components/Registrar';

function App() {
  return(
    <div className="bg-slate-300 h-screen text-black flex">
       <AuthProvider>

      <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>        
        } 
      />
      <Route path="/login" element={<Login/>}  />
      <Route path='/register' element={<Register/>} />
      <Route path='/horarios' element={<Horarios/>} />
      <Route path='/registrar' element={<Registrar/>} />
      </Routes>

    </AuthProvider>
    </div>
  )
}
export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Feed from './pages/Feed';
import NovoAnuncio from './pages/NovoAnuncio';

// Criamos um componente que atua como "Guarda Costas" das rotas
const RotaProtegida = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/feed" element={<Feed />} />

        <Route 
          path="/novo-anuncio" 
          element={
            <RotaProtegida>
              <NovoAnuncio />
            </RotaProtegida>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
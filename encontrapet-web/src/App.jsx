import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* redireciona a raiz "/" diretamente para o "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* rotas principais */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
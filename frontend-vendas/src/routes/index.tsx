import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Vendas from '../pages/Vendas';
import Estoque from '../pages/Estoque';
import Relatorios from '../pages/Relatorios';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/vendas" element={<Vendas />} />
      <Route path="/estoque" element={<Estoque />} />
      <Route path="/relatorios" element={<Relatorios />} />
    </Routes>
  );
};

export default AppRoutes;
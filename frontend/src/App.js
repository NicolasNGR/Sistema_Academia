import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Alunos from './pages/Alunos';
import Planos from './pages/Planos';
import PersonalTrainers from './pages/PersonalTrainers';
import Treinos from './pages/Treinos';
import Frequencia from './pages/Frequencia';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="layout">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/"           element={<Dashboard />} />
              <Route path="/alunos"     element={<Alunos />} />
              <Route path="/planos"     element={<Planos />} />
              <Route path="/personais"  element={<PersonalTrainers />} />
              <Route path="/treinos"    element={<Treinos />} />
              <Route path="/frequencia" element={<Frequencia />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

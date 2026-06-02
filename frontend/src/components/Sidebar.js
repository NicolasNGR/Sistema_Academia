import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/',          label: 'Dashboard',        icon: '📊' },
  { to: '/alunos',    label: 'Alunos',            icon: '🏃' },
  { to: '/planos',    label: 'Planos',            icon: '📋' },
  { to: '/personais', label: 'Personal Trainers', icon: '💪' },
  { to: '/treinos',   label: 'Treinos',           icon: '🏋️' },
  { to: '/frequencia',label: 'Frequência',        icon: '📅' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>💪 AcademiaFit</h1>
        <span>Sistema de Gestão</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

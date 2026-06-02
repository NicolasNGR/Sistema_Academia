import { useEffect, useState } from 'react';
import { alunosAPI, planosAPI, personaisAPI, treinosAPI } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({ ativos: 0, planos: 0, personais: 0, treinos: 0 });
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [ativos, planos, personais, treinos, alunosList] = await Promise.all([
          alunosAPI.contarAtivos(),
          planosAPI.listar(),
          personaisAPI.listar(),
          treinosAPI.listar(),
          alunosAPI.listar(),
        ]);
        setStats({
          ativos:   ativos.data.total,
          planos:   planos.data.length,
          personais:personais.data.length,
          treinos:  treinos.data.length,
        });
        setAlunos(alunosList.data.slice(0, 8));
      } catch { /* silently fail */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const statusBadge = s => {
    const map = { ATIVO: 'badge-green', INATIVO: 'badge-red', SUSPENSO: 'badge-yellow' };
    return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>;
  };

  if (loading) return <div className="loading">Carregando...</div>;

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Visão geral do sistema de gestão da academia</p>
      </div>

      <div className="cards-grid">
        <div className="stat-card">
          <div className="icon red"><span>🏃</span></div>
          <div><div className="label">Alunos Ativos</div><div className="value">{stats.ativos}</div></div>
        </div>
        <div className="stat-card">
          <div className="icon blue"><span>📋</span></div>
          <div><div className="label">Planos</div><div className="value">{stats.planos}</div></div>
        </div>
        <div className="stat-card">
          <div className="icon green"><span>💪</span></div>
          <div><div className="label">Personal Trainers</div><div className="value">{stats.personais}</div></div>
        </div>
        <div className="stat-card">
          <div className="icon purple"><span>🏋️</span></div>
          <div><div className="label">Treinos Cadastrados</div><div className="value">{stats.treinos}</div></div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <h3>Alunos Recentes</h3>
        </div>
        {alunos.length === 0 ? (
          <div className="empty-state"><p>Nenhum aluno cadastrado ainda.</p></div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Plano</th>
                <th>Status</th>
                <th>Matrícula</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.nome}</strong></td>
                  <td>{a.cpf}</td>
                  <td>{a.plano?.nome || <span style={{color:'#9ca3af'}}>Sem plano</span>}</td>
                  <td>{statusBadge(a.status)}</td>
                  <td>{a.dataMatricula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

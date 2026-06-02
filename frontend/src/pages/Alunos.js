import { useEffect, useState, useCallback } from 'react';
import { alunosAPI, planosAPI } from '../services/api';
import { useToast } from '../hooks/useToast';

const EMPTY = { nome: '', cpf: '', dataNascimento: '', telefone: '', email: '', status: 'ATIVO', plano: { id: '' } };

export default function Alunos() {
  const toast   = useToast();
  const [alunos, setAlunos]   = useState([]);
  const [planos, setPlanos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [a, p] = await Promise.all([alunosAPI.listar(), planosAPI.listarAtivos()]);
      setAlunos(a.data);
      setPlanos(p.data);
    } catch { toast('Erro ao carregar dados.', 'error'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const filtered = alunos.filter(a =>
    a.nome.toLowerCase().includes(search.toLowerCase()) ||
    a.cpf.includes(search)
  );

  function openNew()    { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(a)  {
    setForm({
      nome: a.nome, cpf: a.cpf, dataNascimento: a.dataNascimento,
      telefone: a.telefone, email: a.email || '', status: a.status,
      plano: { id: a.plano?.id || '' }
    });
    setEditId(a.id);
    setShowForm(true);
  }
  function closeForm()  { setShowForm(false); setForm(EMPTY); setEditId(null); }

  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'planoId') { setForm(f => ({ ...f, plano: { id: value } })); return; }
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, plano: form.plano.id ? { id: Number(form.plano.id) } : null };
    try {
      if (editId) {
        await alunosAPI.atualizar(editId, payload);
        toast('Aluno atualizado com sucesso!');
      } else {
        await alunosAPI.cadastrar(payload);
        toast('Aluno cadastrado com sucesso!');
      }
      closeForm(); load();
    } catch (err) {
      toast(err.response?.data?.error || 'Erro ao salvar.', 'error');
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Confirma a exclusão deste aluno?')) return;
    try { await alunosAPI.remover(id); toast('Aluno removido.'); load(); }
    catch (err) { toast(err.response?.data?.error || 'Erro ao remover.', 'error'); }
  }

  async function toggleStatus(a) {
    const novo = a.status === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    try { await alunosAPI.alterarStatus(a.id, novo); toast(`Status alterado para ${novo}.`); load(); }
    catch { toast('Erro ao alterar status.', 'error'); }
  }

  const badge = s => {
    const map = { ATIVO: 'badge-green', INATIVO: 'badge-red', SUSPENSO: 'badge-yellow' };
    return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <h2>Alunos</h2>
        <p>Cadastro e gerenciamento de alunos</p>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Buscar por nome ou CPF..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ Novo Aluno</button>
        </div>

        {loading ? <div className="loading">Carregando...</div> : filtered.length === 0 ? (
          <div className="empty-state"><p>Nenhum aluno encontrado.</p></div>
        ) : (
          <table>
            <thead><tr><th>Nome</th><th>CPF</th><th>Telefone</th><th>Plano</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.nome}</strong><br /><small style={{color:'#9ca3af'}}>{a.email}</small></td>
                  <td>{a.cpf}</td>
                  <td>{a.telefone}</td>
                  <td>{a.plano?.nome || <span style={{color:'#9ca3af'}}>—</span>}</td>
                  <td>{badge(a.status)}</td>
                  <td>
                    <div className="text-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(a)}>Editar</button>
                      <button className="btn btn-sm" style={{background:'#f0fdf4',color:'#15803d'}} onClick={() => toggleStatus(a)}>
                        {a.status === 'ATIVO' ? 'Inativar' : 'Ativar'}
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}>Excluir</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="form-overlay" onClick={closeForm}>
          <div className="form-modal" onClick={e => e.stopPropagation()}>
            <div className="form-modal-header">
              <h3>{editId ? 'Editar Aluno' : 'Novo Aluno'}</h3>
              <button className="btn btn-secondary btn-icon" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-modal-body">
                <div className="form-group">
                  <label>Nome Completo *</label>
                  <input name="nome" value={form.nome} onChange={handleChange} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>CPF *</label>
                    <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="000.000.000-00" required />
                  </div>
                  <div className="form-group">
                    <label>Data de Nascimento *</label>
                    <input name="dataNascimento" type="date" value={form.dataNascimento} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Telefone *</label>
                    <input name="telefone" value={form.telefone} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>E-mail</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Plano</label>
                    <select name="planoId" value={form.plano.id} onChange={handleChange}>
                      <option value="">Sem plano</option>
                      {planos.map(p => <option key={p.id} value={p.id}>{p.nome} — R$ {Number(p.valorMensal).toFixed(2)}</option>)}
                    </select>
                  </div>
                  {editId && (
                    <div className="form-group">
                      <label>Status</label>
                      <select name="status" value={form.status} onChange={handleChange}>
                        <option value="ATIVO">Ativo</option>
                        <option value="INATIVO">Inativo</option>
                        <option value="SUSPENSO">Suspenso</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeForm}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Salvando...' : editId ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

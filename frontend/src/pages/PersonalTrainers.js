import { useEffect, useState, useCallback } from 'react';
import { personaisAPI } from '../services/api';
import { useToast } from '../hooks/useToast';

const EMPTY = { nome: '', cref: '', especialidade: '', email: '', telefone: '' };

export default function PersonalTrainers() {
  const toast   = useToast();
  const [lista, setLista]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await personaisAPI.listar(); setLista(r.data); }
    catch { toast('Erro ao carregar personais.', 'error'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const filtered = lista.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.especialidade.toLowerCase().includes(search.toLowerCase()) ||
    p.cref.toLowerCase().includes(search.toLowerCase())
  );

  function openNew()   { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(p) { setForm({ nome: p.nome, cref: p.cref, especialidade: p.especialidade, email: p.email || '', telefone: p.telefone || '', disponivel: p.disponivel }); setEditId(p.id); setShowForm(true); }
  function closeForm() { setShowForm(false); setForm(EMPTY); setEditId(null); }
  function handleChange(e) { const { name, value } = e.target; setForm(f => ({ ...f, [name]: value })); }

  async function handleSubmit(e) {
    e.preventDefault(); setSaving(true);
    try {
      if (editId) { await personaisAPI.atualizar(editId, form); toast('Personal atualizado!'); }
      else        { await personaisAPI.cadastrar(form);          toast('Personal cadastrado!'); }
      closeForm(); load();
    } catch (err) { toast(err.response?.data?.error || 'Erro ao salvar.', 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Confirma exclusão?')) return;
    try { await personaisAPI.remover(id); toast('Personal removido.'); load(); }
    catch (err) { toast(err.response?.data?.error || 'Erro ao remover.', 'error'); }
  }

  async function toggleDisp(p) {
    try { await personaisAPI.alterarDisp(p.id, !p.disponivel); toast('Disponibilidade atualizada.'); load(); }
    catch { toast('Erro.', 'error'); }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Personal Trainers</h2>
        <p>Cadastro e disponibilidade dos instrutores</p>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Buscar por nome, especialidade ou CREF..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ Novo Personal</button>
        </div>
        {loading ? <div className="loading">Carregando...</div> : filtered.length === 0 ? (
          <div className="empty-state"><p>Nenhum personal trainer encontrado.</p></div>
        ) : (
          <table>
            <thead><tr><th>Nome</th><th>CREF</th><th>Especialidade</th><th>Contato</th><th>Disponível</th><th>Ações</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.nome}</strong></td>
                  <td><span className="badge badge-blue">{p.cref}</span></td>
                  <td>{p.especialidade}</td>
                  <td><div>{p.telefone}</div><small style={{color:'#9ca3af'}}>{p.email}</small></td>
                  <td><span className={`badge ${p.disponivel ? 'badge-green' : 'badge-red'}`}>{p.disponivel ? 'Sim' : 'Não'}</span></td>
                  <td>
                    <div className="text-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>Editar</button>
                      <button className="btn btn-sm" style={{background:'#f0fdf4',color:'#15803d'}} onClick={() => toggleDisp(p)}>{p.disponivel ? 'Ocupar' : 'Liberar'}</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>Excluir</button>
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
              <h3>{editId ? 'Editar Personal Trainer' : 'Novo Personal Trainer'}</h3>
              <button className="btn btn-secondary btn-icon" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-modal-body">
                <div className="form-group"><label>Nome Completo *</label><input name="nome" value={form.nome} onChange={handleChange} required /></div>
                <div className="form-row">
                  <div className="form-group"><label>CREF *</label><input name="cref" value={form.cref} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Especialidade *</label><input name="especialidade" value={form.especialidade} onChange={handleChange} required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>E-mail</label><input name="email" type="email" value={form.email} onChange={handleChange} /></div>
                  <div className="form-group"><label>Telefone</label><input name="telefone" value={form.telefone} onChange={handleChange} /></div>
                </div>
              </div>
              <div className="form-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeForm}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Salvando...' : editId ? 'Atualizar' : 'Cadastrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

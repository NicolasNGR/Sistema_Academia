import { useEffect, useState, useCallback } from 'react';
import { treinosAPI, alunosAPI, personaisAPI } from '../services/api';
import { useToast } from '../hooks/useToast';

const EMPTY = { tipo: '', descricao: '', duracaoMinutos: 60, aluno: { id: '' }, personalTrainer: { id: '' } };

export default function Treinos() {
  const toast = useToast();
  const [treinos,   setTreinos]   = useState([]);
  const [alunos,    setAlunos]    = useState([]);
  const [personais, setPersonais] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState(EMPTY);
  const [editId,    setEditId]    = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [filterAluno, setFilterAluno] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, a, p] = await Promise.all([treinosAPI.listar(), alunosAPI.listar(), personaisAPI.listar()]);
      setTreinos(t.data); setAlunos(a.data); setPersonais(p.data);
    } catch { toast('Erro ao carregar.', 'error'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const filtered = treinos.filter(t =>
    filterAluno === '' || t.aluno?.nome.toLowerCase().includes(filterAluno.toLowerCase())
  );

  function openNew()   { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(t) {
    setForm({ tipo: t.tipo, descricao: t.descricao || '', duracaoMinutos: t.duracaoMinutos, aluno: { id: t.aluno?.id || '' }, personalTrainer: { id: t.personalTrainer?.id || '' } });
    setEditId(t.id); setShowForm(true);
  }
  function closeForm() { setShowForm(false); setForm(EMPTY); setEditId(null); }
  function handleChange(e) {
    const { name, value } = e.target;
    if (name === 'alunoId') { setForm(f => ({ ...f, aluno: { id: value } })); return; }
    if (name === 'personalId') { setForm(f => ({ ...f, personalTrainer: { id: value } })); return; }
    setForm(f => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, duracaoMinutos: Number(form.duracaoMinutos), aluno: { id: Number(form.aluno.id) }, personalTrainer: form.personalTrainer.id ? { id: Number(form.personalTrainer.id) } : null };
    try {
      if (editId) { await treinosAPI.atualizar(editId, payload); toast('Treino atualizado!'); }
      else        { await treinosAPI.cadastrar(payload);          toast('Treino cadastrado!'); }
      closeForm(); load();
    } catch (err) { toast(err.response?.data?.error || 'Erro ao salvar.', 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Confirma exclusão do treino?')) return;
    try { await treinosAPI.remover(id); toast('Treino removido.'); load(); }
    catch { toast('Erro ao remover.', 'error'); }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Treinos</h2>
        <p>Fichas de treino vinculadas aos alunos</p>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input placeholder="Filtrar por aluno..." value={filterAluno} onChange={e => setFilterAluno(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={openNew}>+ Novo Treino</button>
        </div>
        {loading ? <div className="loading">Carregando...</div> : filtered.length === 0 ? (
          <div className="empty-state"><p>Nenhum treino encontrado.</p></div>
        ) : (
          <table>
            <thead><tr><th>Tipo</th><th>Aluno</th><th>Personal</th><th>Duração</th><th>Criado em</th><th>Ações</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td><strong>{t.tipo}</strong></td>
                  <td>{t.aluno?.nome || '—'}</td>
                  <td>{t.personalTrainer?.nome || <span style={{color:'#9ca3af'}}>Sem personal</span>}</td>
                  <td>{t.duracaoMinutos} min</td>
                  <td>{t.dataCriacao}</td>
                  <td>
                    <div className="text-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(t)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id)}>Excluir</button>
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
              <h3>{editId ? 'Editar Treino' : 'Novo Treino'}</h3>
              <button className="btn btn-secondary btn-icon" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-modal-body">
                <div className="form-group">
                  <label>Aluno *</label>
                  <select name="alunoId" value={form.aluno.id} onChange={handleChange} required>
                    <option value="">Selecione...</option>
                    {alunos.filter(a => a.status === 'ATIVO').map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tipo de Treino *</label>
                    <input name="tipo" value={form.tipo} onChange={handleChange} placeholder="Ex: Musculação, Cardio..." required />
                  </div>
                  <div className="form-group">
                    <label>Duração (minutos) *</label>
                    <input name="duracaoMinutos" type="number" min="1" value={form.duracaoMinutos} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Personal Trainer (opcional)</label>
                  <select name="personalId" value={form.personalTrainer.id} onChange={handleChange}>
                    <option value="">Nenhum</option>
                    {personais.map(p => <option key={p.id} value={p.id}>{p.nome} — {p.especialidade}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Descrição / Observações</label>
                  <textarea name="descricao" rows={4} value={form.descricao} onChange={handleChange} placeholder="Descreva os exercícios, séries, cargas..." />
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

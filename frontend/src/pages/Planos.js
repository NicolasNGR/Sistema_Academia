import { useEffect, useState, useCallback } from 'react';
import { planosAPI } from '../services/api';
import { useToast } from '../hooks/useToast';

const EMPTY = { nome: '', descricao: '', valorMensal: '', duracaoMeses: 1, limiteAcessosMensais: '' };

export default function Planos() {
  const toast   = useToast();
  const [planos, setPlanos]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY);
  const [editId, setEditId]     = useState(null);
  const [saving, setSaving]     = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await planosAPI.listar(); setPlanos(r.data); }
    catch { toast('Erro ao carregar planos.', 'error'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  function openNew()   { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function openEdit(p) { setForm({ nome: p.nome, descricao: p.descricao || '', valorMensal: p.valorMensal, duracaoMeses: p.duracaoMeses, limiteAcessosMensais: p.limiteAcessosMensais || '' }); setEditId(p.id); setShowForm(true); }
  function closeForm() { setShowForm(false); setForm(EMPTY); setEditId(null); }
  function handleChange(e) { const { name, value } = e.target; setForm(f => ({ ...f, [name]: value })); }

  async function handleSubmit(e) {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, valorMensal: Number(form.valorMensal), duracaoMeses: Number(form.duracaoMeses), limiteAcessosMensais: form.limiteAcessosMensais ? Number(form.limiteAcessosMensais) : null };
    try {
      if (editId) { await planosAPI.atualizar(editId, payload); toast('Plano atualizado!'); }
      else        { await planosAPI.cadastrar(payload);          toast('Plano cadastrado!'); }
      closeForm(); load();
    } catch (err) { toast(err.response?.data?.error || 'Erro ao salvar.', 'error'); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!window.confirm('Confirma exclusão do plano?')) return;
    try { await planosAPI.remover(id); toast('Plano removido.'); load(); }
    catch (err) { toast(err.response?.data?.error || 'Erro ao remover.', 'error'); }
  }

  async function toggleAtivo(p) {
    try { await planosAPI.alterarAtivo(p.id, !p.ativo); toast(`Plano ${p.ativo ? 'desativado' : 'ativado'}.`); load(); }
    catch { toast('Erro ao alterar status.', 'error'); }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Planos</h2>
        <p>Gerenciar planos e mensalidades da academia</p>
      </div>

      <div className="table-card">
        <div className="table-card-header">
          <h3>Planos cadastrados</h3>
          <button className="btn btn-primary" onClick={openNew}>+ Novo Plano</button>
        </div>
        {loading ? <div className="loading">Carregando...</div> : planos.length === 0 ? (
          <div className="empty-state"><p>Nenhum plano cadastrado ainda.</p></div>
        ) : (
          <table>
            <thead><tr><th>Nome</th><th>Descrição</th><th>Valor Mensal</th><th>Duração</th><th>Acessos/mês</th><th>Status</th><th>Ações</th></tr></thead>
            <tbody>
              {planos.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.nome}</strong></td>
                  <td style={{maxWidth:200,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.descricao || '—'}</td>
                  <td><strong style={{color:'#15803d'}}>R$ {Number(p.valorMensal).toFixed(2)}</strong></td>
                  <td>{p.duracaoMeses} {p.duracaoMeses === 1 ? 'mês' : 'meses'}</td>
                  <td>{p.limiteAcessosMensais ?? 'Ilimitado'}</td>
                  <td><span className={`badge ${p.ativo ? 'badge-green' : 'badge-red'}`}>{p.ativo ? 'Ativo' : 'Inativo'}</span></td>
                  <td>
                    <div className="text-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>Editar</button>
                      <button className="btn btn-sm" style={{background:'#f0fdf4',color:'#15803d'}} onClick={() => toggleAtivo(p)}>{p.ativo ? 'Desativar' : 'Ativar'}</button>
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
              <h3>{editId ? 'Editar Plano' : 'Novo Plano'}</h3>
              <button className="btn btn-secondary btn-icon" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-modal-body">
                <div className="form-group"><label>Nome do Plano *</label><input name="nome" value={form.nome} onChange={handleChange} required /></div>
                <div className="form-group"><label>Descrição</label><textarea name="descricao" rows={3} value={form.descricao} onChange={handleChange} /></div>
                <div className="form-row">
                  <div className="form-group"><label>Valor Mensal (R$) *</label><input name="valorMensal" type="number" step="0.01" min="0.01" value={form.valorMensal} onChange={handleChange} required /></div>
                  <div className="form-group"><label>Duração (meses) *</label><input name="duracaoMeses" type="number" min="1" value={form.duracaoMeses} onChange={handleChange} required /></div>
                </div>
                <div className="form-group"><label>Limite de Acessos/Mês (deixe vazio para ilimitado)</label><input name="limiteAcessosMensais" type="number" min="1" value={form.limiteAcessosMensais} onChange={handleChange} /></div>
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

import { useEffect, useState, useCallback } from 'react';
import { alunosAPI, frequenciasAPI } from '../services/api';
import { useToast } from '../hooks/useToast';

export default function Frequencia() {
  const toast = useToast();
  const [alunos,   setAlunos]   = useState([]);
  const [historico, setHistorico] = useState([]);
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [loadingHist, setLoadingHist] = useState(false);
  const [saving,   setSaving]   = useState(false);

  const loadAlunos = useCallback(async () => {
    setLoading(true);
    try { const r = await alunosAPI.buscarPorStatus('ATIVO'); setAlunos(r.data); }
    catch { toast('Erro ao carregar alunos.', 'error'); }
    finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { loadAlunos(); }, [loadAlunos]);

  async function selectAluno(a) {
    setSelected(a);
    setLoadingHist(true);
    try { const r = await frequenciasAPI.listarPorAluno(a.id); setHistorico(r.data.slice(0, 10)); }
    catch { toast('Erro ao carregar histórico.', 'error'); }
    finally { setLoadingHist(false); }
  }

  async function entrada() {
    if (!selected) return;
    setSaving(true);
    try { await frequenciasAPI.registrarEntrada(selected.id); toast(`Entrada de ${selected.nome} registrada!`); selectAluno(selected); }
    catch (err) { toast(err.response?.data?.error || 'Erro ao registrar entrada.', 'error'); }
    finally { setSaving(false); }
  }

  async function saida() {
    if (!selected) return;
    setSaving(true);
    try { await frequenciasAPI.registrarSaida(selected.id); toast(`Saída de ${selected.nome} registrada!`); selectAluno(selected); }
    catch (err) { toast(err.response?.data?.error || 'Erro ao registrar saída.', 'error'); }
    finally { setSaving(false); }
  }

  const filtered = alunos.filter(a =>
    a.nome.toLowerCase().includes(search.toLowerCase()) ||
    a.cpf.includes(search)
  );

  function fmt(dt) {
    if (!dt) return '—';
    return new Date(dt).toLocaleString('pt-BR');
  }

  const emAberto = historico.find(h => !h.dataSaida);

  return (
    <div>
      <div className="page-header">
        <h2>Controle de Frequência</h2>
        <p>Registre a entrada e saída dos alunos</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 24 }}>
        {/* Lista de alunos */}
        <div className="table-card">
          <div className="table-card-header" style={{flexDirection:'column',alignItems:'stretch',gap:12}}>
            <h3>Selecione o Aluno</h3>
            <div className="search-bar" style={{maxWidth:'100%'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input placeholder="Buscar aluno..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          {loading ? <div className="loading">Carregando...</div> : (
            <div style={{maxHeight:420,overflowY:'auto'}}>
              {filtered.map(a => (
                <div
                  key={a.id}
                  onClick={() => selectAluno(a)}
                  style={{
                    padding: '14px 20px', cursor: 'pointer',
                    borderBottom: '1px solid #f3f4f6',
                    background: selected?.id === a.id ? '#fef2f2' : '#fff',
                    borderLeft: selected?.id === a.id ? '3px solid #e94560' : '3px solid transparent',
                    transition: 'all .15s',
                  }}
                >
                  <div style={{fontWeight:600}}>{a.nome}</div>
                  <div style={{fontSize:'.8rem',color:'#9ca3af'}}>{a.cpf} — {a.plano?.nome || 'Sem plano'}</div>
                </div>
              ))}
              {filtered.length === 0 && <div className="empty-state"><p>Nenhum aluno ativo encontrado.</p></div>}
            </div>
          )}
        </div>

        {/* Painel de ações */}
        <div style={{display:'flex',flexDirection:'column',gap:20}}>
          <div className="table-card" style={{padding:28}}>
            {!selected ? (
              <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"/></svg>
                <p>Selecione um aluno ao lado para registrar frequência</p>
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:20}}>
                <div>
                  <h3 style={{fontSize:'1.2rem',fontWeight:700}}>{selected.nome}</h3>
                  <p style={{color:'#6b7280',fontSize:'.875rem'}}>{selected.plano?.nome || 'Sem plano'} — {selected.cpf}</p>
                </div>
                {emAberto && (
                  <div style={{background:'#fef9c3',border:'1px solid #fde68a',borderRadius:10,padding:'12px 16px',fontSize:'.875rem'}}>
                    ⚠️ Entrada em aberto desde {fmt(emAberto.dataEntrada)}
                  </div>
                )}
                <div style={{display:'flex',gap:12}}>
                  <button
                    className="btn btn-success"
                    style={{flex:1,justifyContent:'center',padding:'14px'}}
                    onClick={entrada}
                    disabled={saving || !!emAberto}
                  >
                    ✅ Registrar Entrada
                  </button>
                  <button
                    className="btn btn-danger"
                    style={{flex:1,justifyContent:'center',padding:'14px'}}
                    onClick={saida}
                    disabled={saving || !emAberto}
                  >
                    🚪 Registrar Saída
                  </button>
                </div>
              </div>
            )}
          </div>

          {selected && (
            <div className="table-card">
              <div className="table-card-header"><h3>Últimas 10 visitas</h3></div>
              {loadingHist ? <div className="loading">Carregando...</div> : historico.length === 0 ? (
                <div className="empty-state"><p>Nenhuma visita registrada.</p></div>
              ) : (
                <table>
                  <thead><tr><th>Entrada</th><th>Saída</th><th>Status</th></tr></thead>
                  <tbody>
                    {historico.map(h => (
                      <tr key={h.id}>
                        <td>{fmt(h.dataEntrada)}</td>
                        <td>{fmt(h.dataSaida)}</td>
                        <td><span className={`badge ${h.dataSaida ? 'badge-green' : 'badge-yellow'}`}>{h.dataSaida ? 'Concluído' : 'Em aberto'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Alunos ──────────────────────────────────────────────
export const alunosAPI = {
  listar:          ()           => api.get('/alunos'),
  buscarPorId:     (id)         => api.get(`/alunos/${id}`),
  buscarPorNome:   (nome)       => api.get(`/alunos/busca?nome=${nome}`),
  buscarPorStatus: (status)     => api.get(`/alunos/status/${status}`),
  contarAtivos:    ()           => api.get('/alunos/ativos/count'),
  cadastrar:       (data)       => api.post('/alunos', data),
  atualizar:       (id, data)   => api.put(`/alunos/${id}`, data),
  alterarStatus:   (id, status) => api.patch(`/alunos/${id}/status?status=${status}`),
  remover:         (id)         => api.delete(`/alunos/${id}`),
};

// ── Planos ──────────────────────────────────────────────
export const planosAPI = {
  listar:       ()         => api.get('/planos'),
  listarAtivos: ()         => api.get('/planos/ativos'),
  buscarPorId:  (id)       => api.get(`/planos/${id}`),
  cadastrar:    (data)     => api.post('/planos', data),
  atualizar:    (id, data) => api.put(`/planos/${id}`, data),
  alterarAtivo: (id, val)  => api.patch(`/planos/${id}/ativo?ativo=${val}`),
  remover:      (id)       => api.delete(`/planos/${id}`),
};

// ── Personal Trainers ───────────────────────────────────
export const personaisAPI = {
  listar:            ()         => api.get('/personais'),
  listarDisponiveis: ()         => api.get('/personais/disponiveis'),
  buscarPorId:       (id)       => api.get(`/personais/${id}`),
  cadastrar:         (data)     => api.post('/personais', data),
  atualizar:         (id, data) => api.put(`/personais/${id}`, data),
  alterarDisp:       (id, val)  => api.patch(`/personais/${id}/disponibilidade?disponivel=${val}`),
  remover:           (id)       => api.delete(`/personais/${id}`),
};

// ── Treinos ─────────────────────────────────────────────
export const treinosAPI = {
  listar:          ()         => api.get('/treinos'),
  buscarPorAluno:  (alunoId) => api.get(`/treinos/aluno/${alunoId}`),
  cadastrar:       (data)    => api.post('/treinos', data),
  atualizar:       (id, data)=> api.put(`/treinos/${id}`, data),
  remover:         (id)      => api.delete(`/treinos/${id}`),
};

// ── Frequências ─────────────────────────────────────────
export const frequenciasAPI = {
  listarPorAluno:   (alunoId) => api.get(`/frequencias/aluno/${alunoId}`),
  registrarEntrada: (alunoId) => api.post(`/frequencias/entrada/${alunoId}`),
  registrarSaida:   (alunoId) => api.patch(`/frequencias/saida/${alunoId}`),
};

export default api;

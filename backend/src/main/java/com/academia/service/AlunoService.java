package com.academia.service;

import com.academia.exception.BusinessException;
import com.academia.exception.ResourceNotFoundException;
import com.academia.model.Aluno;
import com.academia.model.Plano;
import com.academia.repository.AlunoRepository;
import com.academia.repository.PlanoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final PlanoRepository planoRepository;

    public List<Aluno> listarTodos() {
        return alunoRepository.findAllOrderByNome();
    }

    public Aluno buscarPorId(Long id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado com ID: " + id));
    }

    public Aluno buscarPorCpf(String cpf) {
        return alunoRepository.findByCpf(cpf)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado com CPF: " + cpf));
    }

    public List<Aluno> buscarPorNome(String nome) {
        return alunoRepository.findByNomeContainingIgnoreCase(nome);
    }

    public List<Aluno> buscarPorStatus(Aluno.StatusAluno status) {
        return alunoRepository.findByStatus(status);
    }

    @Transactional
    public Aluno cadastrar(Aluno aluno) {
        if (alunoRepository.existsByCpf(aluno.getCpf())) {
            throw new BusinessException("Já existe um aluno cadastrado com o CPF: " + aluno.getCpf());
        }
        if (aluno.getPlano() != null && aluno.getPlano().getId() != null) {
            Plano plano = planoRepository.findById(aluno.getPlano().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Plano não encontrado com ID: " + aluno.getPlano().getId()));
            if (!plano.getAtivo()) {
                throw new BusinessException("O plano selecionado está inativo.");
            }
            aluno.setPlano(plano);
        }
        return alunoRepository.save(aluno);
    }

    @Transactional
    public Aluno atualizar(Long id, Aluno alunoAtualizado) {
        Aluno aluno = buscarPorId(id);

        if (!aluno.getCpf().equals(alunoAtualizado.getCpf()) && alunoRepository.existsByCpf(alunoAtualizado.getCpf())) {
            throw new BusinessException("Já existe um aluno cadastrado com o CPF: " + alunoAtualizado.getCpf());
        }

        aluno.setNome(alunoAtualizado.getNome());
        aluno.setCpf(alunoAtualizado.getCpf());
        aluno.setDataNascimento(alunoAtualizado.getDataNascimento());
        aluno.setTelefone(alunoAtualizado.getTelefone());
        aluno.setEmail(alunoAtualizado.getEmail());
        aluno.setStatus(alunoAtualizado.getStatus());

        if (alunoAtualizado.getPlano() != null && alunoAtualizado.getPlano().getId() != null) {
            Plano plano = planoRepository.findById(alunoAtualizado.getPlano().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Plano não encontrado."));
            aluno.setPlano(plano);
        }

        return alunoRepository.save(aluno);
    }

    @Transactional
    public void remover(Long id) {
        Aluno aluno = buscarPorId(id);
        alunoRepository.delete(aluno);
    }

    @Transactional
    public Aluno alterarStatus(Long id, Aluno.StatusAluno novoStatus) {
        Aluno aluno = buscarPorId(id);
        aluno.setStatus(novoStatus);
        return alunoRepository.save(aluno);
    }

    public Long contarAtivos() {
        return alunoRepository.countAtivos();
    }
}

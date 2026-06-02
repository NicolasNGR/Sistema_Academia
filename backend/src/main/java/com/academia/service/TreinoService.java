package com.academia.service;

import com.academia.exception.BusinessException;
import com.academia.exception.ResourceNotFoundException;
import com.academia.model.Aluno;
import com.academia.model.PersonalTrainer;
import com.academia.model.Treino;
import com.academia.repository.AlunoRepository;
import com.academia.repository.PersonalTrainerRepository;
import com.academia.repository.TreinoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TreinoService {

    private final TreinoRepository treinoRepository;
    private final AlunoRepository alunoRepository;
    private final PersonalTrainerRepository personalRepository;

    public List<Treino> listarTodos() {
        return treinoRepository.findAll();
    }

    public Treino buscarPorId(Long id) {
        return treinoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Treino não encontrado com ID: " + id));
    }

    public List<Treino> buscarPorAluno(Long alunoId) {
        return treinoRepository.findByAlunoIdOrderByData(alunoId);
    }

    public List<Treino> buscarPorPersonal(Long personalId) {
        return treinoRepository.findByPersonalTrainerId(personalId);
    }

    @Transactional
    public Treino cadastrar(Treino treino) {
        Aluno aluno = alunoRepository.findById(treino.getAluno().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado."));

        if (aluno.getStatus() != Aluno.StatusAluno.ATIVO) {
            throw new BusinessException("Só é possível criar treinos para alunos ativos.");
        }

        treino.setAluno(aluno);

        if (treino.getPersonalTrainer() != null && treino.getPersonalTrainer().getId() != null) {
            PersonalTrainer personal = personalRepository.findById(treino.getPersonalTrainer().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Personal Trainer não encontrado."));
            treino.setPersonalTrainer(personal);
        }

        return treinoRepository.save(treino);
    }

    @Transactional
    public Treino atualizar(Long id, Treino atualizado) {
        Treino treino = buscarPorId(id);
        treino.setTipo(atualizado.getTipo());
        treino.setDescricao(atualizado.getDescricao());
        treino.setDuracaoMinutos(atualizado.getDuracaoMinutos());
        return treinoRepository.save(treino);
    }

    @Transactional
    public void remover(Long id) {
        Treino treino = buscarPorId(id);
        treinoRepository.delete(treino);
    }
}

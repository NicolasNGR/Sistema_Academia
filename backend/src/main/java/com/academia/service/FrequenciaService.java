package com.academia.service;

import com.academia.exception.BusinessException;
import com.academia.exception.ResourceNotFoundException;
import com.academia.model.Aluno;
import com.academia.model.Frequencia;
import com.academia.repository.AlunoRepository;
import com.academia.repository.FrequenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FrequenciaService {

    private final FrequenciaRepository frequenciaRepository;
    private final AlunoRepository alunoRepository;

    public List<Frequencia> listarPorAluno(Long alunoId) {
        return frequenciaRepository.findByAlunoIdOrderByData(alunoId);
    }

    public List<Frequencia> listarPorPeriodo(LocalDateTime inicio, LocalDateTime fim) {
        return frequenciaRepository.findByPeriodo(inicio, fim);
    }

    @Transactional
    public Frequencia registrarEntrada(Long alunoId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado com ID: " + alunoId));

        if (aluno.getStatus() != Aluno.StatusAluno.ATIVO) {
            throw new BusinessException("Somente alunos ativos podem registrar frequência.");
        }

        frequenciaRepository.findByAlunoIdAndDataSaidaIsNull(alunoId).ifPresent(f -> {
            throw new BusinessException("Aluno já possui uma entrada em aberto. Registre a saída primeiro.");
        });

        Frequencia frequencia = Frequencia.builder()
                .aluno(aluno)
                .dataEntrada(LocalDateTime.now())
                .build();

        return frequenciaRepository.save(frequencia);
    }

    @Transactional
    public Frequencia registrarSaida(Long alunoId) {
        Frequencia frequencia = frequenciaRepository.findByAlunoIdAndDataSaidaIsNull(alunoId)
                .orElseThrow(() -> new BusinessException("Nenhuma entrada em aberto encontrada para este aluno."));

        frequencia.setDataSaida(LocalDateTime.now());
        return frequenciaRepository.save(frequencia);
    }

    public Long contarAcessosMes(Long alunoId, int mes, int ano) {
        return frequenciaRepository.countByAlunoAndMes(alunoId, mes, ano);
    }
}

package com.academia.service;

import com.academia.exception.BusinessException;
import com.academia.exception.ResourceNotFoundException;
import com.academia.model.Plano;
import com.academia.repository.PlanoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlanoService {

    private final PlanoRepository planoRepository;

    public List<Plano> listarTodos() {
        return planoRepository.findAllOrderByValor();
    }

    public List<Plano> listarAtivos() {
        return planoRepository.findByAtivo(true);
    }

    public Plano buscarPorId(Long id) {
        return planoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plano não encontrado com ID: " + id));
    }

    @Transactional
    public Plano cadastrar(Plano plano) {
        if (planoRepository.existsByNome(plano.getNome())) {
            throw new BusinessException("Já existe um plano com o nome: " + plano.getNome());
        }
        plano.setAtivo(true);
        return planoRepository.save(plano);
    }

    @Transactional
    public Plano atualizar(Long id, Plano planoAtualizado) {
        Plano plano = buscarPorId(id);

        if (!plano.getNome().equals(planoAtualizado.getNome()) && planoRepository.existsByNome(planoAtualizado.getNome())) {
            throw new BusinessException("Já existe um plano com o nome: " + planoAtualizado.getNome());
        }

        plano.setNome(planoAtualizado.getNome());
        plano.setDescricao(planoAtualizado.getDescricao());
        plano.setValorMensal(planoAtualizado.getValorMensal());
        plano.setDuracaoMeses(planoAtualizado.getDuracaoMeses());
        plano.setLimiteAcessosMensais(planoAtualizado.getLimiteAcessosMensais());

        return planoRepository.save(plano);
    }

    @Transactional
    public Plano alterarAtivo(Long id, Boolean ativo) {
        Plano plano = buscarPorId(id);
        plano.setAtivo(ativo);
        return planoRepository.save(plano);
    }

    @Transactional
    public void remover(Long id) {
        Plano plano = buscarPorId(id);
        if (plano.getAlunos() != null && !plano.getAlunos().isEmpty()) {
            throw new BusinessException("Não é possível remover um plano que possui alunos vinculados.");
        }
        planoRepository.delete(plano);
    }
}

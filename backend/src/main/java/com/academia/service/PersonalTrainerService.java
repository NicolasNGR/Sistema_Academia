package com.academia.service;

import com.academia.exception.BusinessException;
import com.academia.exception.ResourceNotFoundException;
import com.academia.model.PersonalTrainer;
import com.academia.repository.PersonalTrainerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PersonalTrainerService {

    private final PersonalTrainerRepository repository;

    public List<PersonalTrainer> listarTodos() {
        return repository.findAll();
    }

    public List<PersonalTrainer> listarDisponiveis() {
        return repository.findByDisponivel(true);
    }

    public PersonalTrainer buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personal Trainer não encontrado com ID: " + id));
    }

    public List<PersonalTrainer> buscarPorEspecialidade(String especialidade) {
        return repository.findByEspecialidadeContainingIgnoreCase(especialidade);
    }

    public List<PersonalTrainer> buscarPorNome(String nome) {
        return repository.findByNomeContainingIgnoreCase(nome);
    }

    @Transactional
    public PersonalTrainer cadastrar(PersonalTrainer personal) {
        if (repository.existsByCref(personal.getCref())) {
            throw new BusinessException("Já existe um Personal Trainer com o CREF: " + personal.getCref());
        }
        personal.setDisponivel(true);
        return repository.save(personal);
    }

    @Transactional
    public PersonalTrainer atualizar(Long id, PersonalTrainer atualizado) {
        PersonalTrainer personal = buscarPorId(id);

        if (!personal.getCref().equals(atualizado.getCref()) && repository.existsByCref(atualizado.getCref())) {
            throw new BusinessException("Já existe um Personal Trainer com o CREF: " + atualizado.getCref());
        }

        personal.setNome(atualizado.getNome());
        personal.setCref(atualizado.getCref());
        personal.setEspecialidade(atualizado.getEspecialidade());
        personal.setEmail(atualizado.getEmail());
        personal.setTelefone(atualizado.getTelefone());
        personal.setDisponivel(atualizado.getDisponivel());

        return repository.save(personal);
    }

    @Transactional
    public void remover(Long id) {
        PersonalTrainer personal = buscarPorId(id);
        repository.delete(personal);
    }

    @Transactional
    public PersonalTrainer alterarDisponibilidade(Long id, Boolean disponivel) {
        PersonalTrainer personal = buscarPorId(id);
        personal.setDisponivel(disponivel);
        return repository.save(personal);
    }
}

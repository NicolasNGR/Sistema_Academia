package com.academia.repository;

import com.academia.model.PersonalTrainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PersonalTrainerRepository extends JpaRepository<PersonalTrainer, Long> {

    Optional<PersonalTrainer> findByCref(String cref);

    boolean existsByCref(String cref);

    List<PersonalTrainer> findByDisponivel(Boolean disponivel);

    List<PersonalTrainer> findByEspecialidadeContainingIgnoreCase(String especialidade);

    List<PersonalTrainer> findByNomeContainingIgnoreCase(String nome);
}

package com.academia.repository;

import com.academia.model.Treino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TreinoRepository extends JpaRepository<Treino, Long> {

    List<Treino> findByAlunoId(Long alunoId);

    List<Treino> findByPersonalTrainerId(Long personalId);

    List<Treino> findByTipoContainingIgnoreCase(String tipo);

    @Query("SELECT t FROM Treino t WHERE t.aluno.id = :alunoId ORDER BY t.dataCriacao DESC")
    List<Treino> findByAlunoIdOrderByData(@Param("alunoId") Long alunoId);
}

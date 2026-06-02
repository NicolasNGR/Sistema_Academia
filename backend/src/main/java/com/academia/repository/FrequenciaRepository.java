package com.academia.repository;

import com.academia.model.Frequencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FrequenciaRepository extends JpaRepository<Frequencia, Long> {

    List<Frequencia> findByAlunoId(Long alunoId);

    @Query("SELECT f FROM Frequencia f WHERE f.aluno.id = :alunoId ORDER BY f.dataEntrada DESC")
    List<Frequencia> findByAlunoIdOrderByData(@Param("alunoId") Long alunoId);

    @Query("SELECT f FROM Frequencia f WHERE f.dataEntrada BETWEEN :inicio AND :fim")
    List<Frequencia> findByPeriodo(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("SELECT COUNT(f) FROM Frequencia f WHERE f.aluno.id = :alunoId AND MONTH(f.dataEntrada) = :mes AND YEAR(f.dataEntrada) = :ano")
    Long countByAlunoAndMes(@Param("alunoId") Long alunoId, @Param("mes") int mes, @Param("ano") int ano);

    Optional<Frequencia> findByAlunoIdAndDataSaidaIsNull(Long alunoId);
}

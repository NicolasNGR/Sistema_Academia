package com.academia.repository;

import com.academia.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {

    Optional<Aluno> findByCpf(String cpf);

    boolean existsByCpf(String cpf);

    List<Aluno> findByNomeContainingIgnoreCase(String nome);

    List<Aluno> findByStatus(Aluno.StatusAluno status);

    List<Aluno> findByPlanoId(Long planoId);

    @Query("SELECT COUNT(a) FROM Aluno a WHERE a.status = 'ATIVO'")
    Long countAtivos();

    @Query("SELECT a FROM Aluno a WHERE a.plano.id = :planoId AND a.status = 'ATIVO'")
    List<Aluno> findAtivosByPlano(@Param("planoId") Long planoId);

    @Query("SELECT a FROM Aluno a ORDER BY a.nome ASC")
    List<Aluno> findAllOrderByNome();
}

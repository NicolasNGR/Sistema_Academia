package com.academia.repository;

import com.academia.model.Plano;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlanoRepository extends JpaRepository<Plano, Long> {

    Optional<Plano> findByNome(String nome);

    boolean existsByNome(String nome);

    List<Plano> findByAtivo(Boolean ativo);

    @Query("SELECT p FROM Plano p ORDER BY p.valorMensal ASC")
    List<Plano> findAllOrderByValor();
}

package com.academia.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "frequencias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Frequencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @Column(name = "data_entrada", nullable = false)
    private LocalDateTime dataEntrada;

    @Column(name = "data_saida")
    private LocalDateTime dataSaida;

    @Column(name = "observacao", length = 500)
    private String observacao;

    @PrePersist
    public void prePersist() {
        if (dataEntrada == null) {
            dataEntrada = LocalDateTime.now();
        }
    }
}

package com.academia.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "treinos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Treino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Tipo de treino é obrigatório")
    @Column(nullable = false)
    private String tipo;

    @Column(length = 1000)
    private String descricao;

    @NotNull(message = "Duração é obrigatória")
    @Min(value = 1, message = "Duração deve ser pelo menos 1 minuto")
    @Column(name = "duracao_minutos", nullable = false)
    private Integer duracaoMinutos;

    @Column(name = "data_criacao", nullable = false)
    private LocalDate dataCriacao;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "personal_id")
    private PersonalTrainer personalTrainer;

    @PrePersist
    public void prePersist() {
        if (dataCriacao == null) {
            dataCriacao = LocalDate.now();
        }
    }
}

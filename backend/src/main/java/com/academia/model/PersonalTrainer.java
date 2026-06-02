package com.academia.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "personal_trainers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalTrainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "CREF é obrigatório")
    @Column(unique = true, nullable = false, length = 20)
    private String cref;

    @NotBlank(message = "Especialidade é obrigatória")
    @Column(nullable = false)
    private String especialidade;

    @Email(message = "E-mail inválido")
    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String telefone;

    @Column(nullable = false)
    private Boolean disponivel = true;

    @OneToMany(mappedBy = "personalTrainer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Treino> treinos;
}

package com.academia.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "alunos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "CPF é obrigatório")
    @Column(unique = true, nullable = false, length = 14)
    private String cpf;

    @NotNull(message = "Data de nascimento é obrigatória")
    @Column(name = "data_nascimento", nullable = false)
    private LocalDate dataNascimento;

    @NotBlank(message = "Telefone é obrigatório")
    @Column(nullable = false, length = 20)
    private String telefone;

    @Email(message = "E-mail inválido")
    @Column(length = 100)
    private String email;

    @Column(name = "data_matricula", nullable = false)
    private LocalDate dataMatricula;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAluno status;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "plano_id")
    private Plano plano;

    @OneToMany(mappedBy = "aluno", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Frequencia> frequencias;

    @PrePersist
    public void prePersist() {
        if (dataMatricula == null) {
            dataMatricula = LocalDate.now();
        }
        if (status == null) {
            status = StatusAluno.ATIVO;
        }
    }

    public enum StatusAluno {
        ATIVO, INATIVO, SUSPENSO
    }
}

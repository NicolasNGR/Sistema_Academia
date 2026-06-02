package com.academia.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "planos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plano {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Nome do plano é obrigatório")
    @Column(nullable = false, unique = true)
    private String nome;

    @Column(length = 500)
    private String descricao;

    @NotNull(message = "Valor mensal é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    @Column(name = "valor_mensal", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorMensal;

    @NotNull(message = "Duração em meses é obrigatória")
    @Min(value = 1, message = "Duração deve ser pelo menos 1 mês")
    @Column(name = "duracao_meses", nullable = false)
    private Integer duracaoMeses;

    @Column(name = "limite_acessos_mensais")
    private Integer limiteAcessosMensais;

    @Column(nullable = false)
    private Boolean ativo = true;

    @OneToMany(mappedBy = "plano", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Aluno> alunos;
}

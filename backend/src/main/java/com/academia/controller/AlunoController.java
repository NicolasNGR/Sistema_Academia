package com.academia.controller;

import com.academia.model.Aluno;
import com.academia.service.AlunoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;

    @GetMapping
    public ResponseEntity<List<Aluno>> listarTodos() {
        return ResponseEntity.ok(alunoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Aluno> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.buscarPorId(id));
    }

    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Aluno> buscarPorCpf(@PathVariable String cpf) {
        return ResponseEntity.ok(alunoService.buscarPorCpf(cpf));
    }

    @GetMapping("/busca")
    public ResponseEntity<List<Aluno>> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(alunoService.buscarPorNome(nome));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Aluno>> buscarPorStatus(@PathVariable Aluno.StatusAluno status) {
        return ResponseEntity.ok(alunoService.buscarPorStatus(status));
    }

    @GetMapping("/ativos/count")
    public ResponseEntity<Map<String, Long>> contarAtivos() {
        return ResponseEntity.ok(Map.of("total", alunoService.contarAtivos()));
    }

    @PostMapping
    public ResponseEntity<Aluno> cadastrar(@Valid @RequestBody Aluno aluno) {
        return ResponseEntity.status(HttpStatus.CREATED).body(alunoService.cadastrar(aluno));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Aluno> atualizar(@PathVariable Long id, @Valid @RequestBody Aluno aluno) {
        return ResponseEntity.ok(alunoService.atualizar(id, aluno));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Aluno> alterarStatus(@PathVariable Long id, @RequestParam Aluno.StatusAluno status) {
        return ResponseEntity.ok(alunoService.alterarStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        alunoService.remover(id);
        return ResponseEntity.noContent().build();
    }
}

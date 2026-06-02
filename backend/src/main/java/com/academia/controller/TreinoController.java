package com.academia.controller;

import com.academia.model.Treino;
import com.academia.service.TreinoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/treinos")
@RequiredArgsConstructor
public class TreinoController {

    private final TreinoService treinoService;

    @GetMapping
    public ResponseEntity<List<Treino>> listarTodos() {
        return ResponseEntity.ok(treinoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Treino> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(treinoService.buscarPorId(id));
    }

    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<Treino>> buscarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(treinoService.buscarPorAluno(alunoId));
    }

    @GetMapping("/personal/{personalId}")
    public ResponseEntity<List<Treino>> buscarPorPersonal(@PathVariable Long personalId) {
        return ResponseEntity.ok(treinoService.buscarPorPersonal(personalId));
    }

    @PostMapping
    public ResponseEntity<Treino> cadastrar(@Valid @RequestBody Treino treino) {
        return ResponseEntity.status(HttpStatus.CREATED).body(treinoService.cadastrar(treino));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Treino> atualizar(@PathVariable Long id, @Valid @RequestBody Treino treino) {
        return ResponseEntity.ok(treinoService.atualizar(id, treino));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        treinoService.remover(id);
        return ResponseEntity.noContent().build();
    }
}

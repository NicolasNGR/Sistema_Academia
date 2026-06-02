package com.academia.controller;

import com.academia.model.Plano;
import com.academia.service.PlanoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planos")
@RequiredArgsConstructor
public class PlanoController {

    private final PlanoService planoService;

    @GetMapping
    public ResponseEntity<List<Plano>> listarTodos() {
        return ResponseEntity.ok(planoService.listarTodos());
    }

    @GetMapping("/ativos")
    public ResponseEntity<List<Plano>> listarAtivos() {
        return ResponseEntity.ok(planoService.listarAtivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plano> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(planoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<Plano> cadastrar(@Valid @RequestBody Plano plano) {
        return ResponseEntity.status(HttpStatus.CREATED).body(planoService.cadastrar(plano));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Plano> atualizar(@PathVariable Long id, @Valid @RequestBody Plano plano) {
        return ResponseEntity.ok(planoService.atualizar(id, plano));
    }

    @PatchMapping("/{id}/ativo")
    public ResponseEntity<Plano> alterarAtivo(@PathVariable Long id, @RequestParam Boolean ativo) {
        return ResponseEntity.ok(planoService.alterarAtivo(id, ativo));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        planoService.remover(id);
        return ResponseEntity.noContent().build();
    }
}

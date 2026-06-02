package com.academia.controller;

import com.academia.model.PersonalTrainer;
import com.academia.service.PersonalTrainerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personais")
@RequiredArgsConstructor
public class PersonalTrainerController {

    private final PersonalTrainerService service;

    @GetMapping
    public ResponseEntity<List<PersonalTrainer>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<PersonalTrainer>> listarDisponiveis() {
        return ResponseEntity.ok(service.listarDisponiveis());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PersonalTrainer> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping("/especialidade")
    public ResponseEntity<List<PersonalTrainer>> buscarPorEspecialidade(@RequestParam String especialidade) {
        return ResponseEntity.ok(service.buscarPorEspecialidade(especialidade));
    }

    @PostMapping
    public ResponseEntity<PersonalTrainer> cadastrar(@Valid @RequestBody PersonalTrainer personal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.cadastrar(personal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonalTrainer> atualizar(@PathVariable Long id, @Valid @RequestBody PersonalTrainer personal) {
        return ResponseEntity.ok(service.atualizar(id, personal));
    }

    @PatchMapping("/{id}/disponibilidade")
    public ResponseEntity<PersonalTrainer> alterarDisponibilidade(@PathVariable Long id, @RequestParam Boolean disponivel) {
        return ResponseEntity.ok(service.alterarDisponibilidade(id, disponivel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        service.remover(id);
        return ResponseEntity.noContent().build();
    }
}

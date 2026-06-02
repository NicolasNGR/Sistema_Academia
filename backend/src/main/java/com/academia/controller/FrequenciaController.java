package com.academia.controller;

import com.academia.model.Frequencia;
import com.academia.service.FrequenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/frequencias")
@RequiredArgsConstructor
public class FrequenciaController {

    private final FrequenciaService frequenciaService;

    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<Frequencia>> listarPorAluno(@PathVariable Long alunoId) {
        return ResponseEntity.ok(frequenciaService.listarPorAluno(alunoId));
    }

    @GetMapping("/periodo")
    public ResponseEntity<List<Frequencia>> listarPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim) {
        return ResponseEntity.ok(frequenciaService.listarPorPeriodo(inicio, fim));
    }

    @PostMapping("/entrada/{alunoId}")
    public ResponseEntity<Frequencia> registrarEntrada(@PathVariable Long alunoId) {
        return ResponseEntity.ok(frequenciaService.registrarEntrada(alunoId));
    }

    @PatchMapping("/saida/{alunoId}")
    public ResponseEntity<Frequencia> registrarSaida(@PathVariable Long alunoId) {
        return ResponseEntity.ok(frequenciaService.registrarSaida(alunoId));
    }

    @GetMapping("/aluno/{alunoId}/mes")
    public ResponseEntity<Map<String, Long>> contarAcessosMes(
            @PathVariable Long alunoId,
            @RequestParam int mes,
            @RequestParam int ano) {
        return ResponseEntity.ok(Map.of("acessos", frequenciaService.contarAcessosMes(alunoId, mes, ano)));
    }
}

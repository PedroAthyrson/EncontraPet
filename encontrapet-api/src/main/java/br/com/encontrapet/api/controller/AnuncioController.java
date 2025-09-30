package br.com.encontrapet.api.controller;

import br.com.encontrapet.api.dto.AnuncioCadastroDTO;
import br.com.encontrapet.api.dto.AnuncioDetalhesDTO;
import br.com.encontrapet.api.model.Usuario;
import br.com.encontrapet.api.service.AnuncioService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/anuncios")
public class AnuncioController {

    @Autowired
    private AnuncioService anuncioService;

    @PostMapping
    public ResponseEntity<AnuncioDetalhesDTO> criar(@RequestBody @Valid AnuncioCadastroDTO dados,
                                                    @AuthenticationPrincipal Usuario usuarioLogado,
                                                    UriComponentsBuilder uriBuilder) {
        AnuncioDetalhesDTO anuncioCriado = anuncioService.criarAnuncio(dados, usuarioLogado);
        URI uri = uriBuilder.path("/anuncios/{id}").buildAndExpand(anuncioCriado.id()).toUri();
        return ResponseEntity.created(uri).body(anuncioCriado);
    }

    @GetMapping
    public ResponseEntity<List<AnuncioDetalhesDTO>> listar() {
        List<AnuncioDetalhesDTO> anuncios = anuncioService.listarTodos();
        return ResponseEntity.ok(anuncios);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnuncioDetalhesDTO> detalhar(@PathVariable Long id) {
        AnuncioDetalhesDTO anuncio = anuncioService.detalharAnuncio(id);
        return ResponseEntity.ok(anuncio);
    }

    @PatchMapping("/{id}/resolver")
    public ResponseEntity<AnuncioDetalhesDTO> marcarComoResolvido(@PathVariable Long id,
                                                                  @AuthenticationPrincipal Usuario usuarioLogado) {
        AnuncioDetalhesDTO anuncioResolvido = anuncioService.marcarComoResolvido(id, usuarioLogado);
        return ResponseEntity.ok(anuncioResolvido);
    }
}
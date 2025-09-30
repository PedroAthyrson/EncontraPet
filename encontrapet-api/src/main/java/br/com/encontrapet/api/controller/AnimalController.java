package br.com.encontrapet.api.controller;

import br.com.encontrapet.api.dto.AnimalCadastroDTO;
import br.com.encontrapet.api.dto.AnimalDetalhesDTO;
import br.com.encontrapet.api.model.Usuario;
import br.com.encontrapet.api.service.AnimalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/animais")
public class AnimalController {

    @Autowired
    private AnimalService animalService;

    @PostMapping
    public ResponseEntity<AnimalDetalhesDTO> cadastrar(@RequestBody @Valid AnimalCadastroDTO dados,
                                                       @AuthenticationPrincipal Usuario usuarioLogado,
                                                       UriComponentsBuilder uriBuilder) {
        AnimalDetalhesDTO animalCadastrado = animalService.cadastrarAnimal(dados, usuarioLogado);
        URI uri = uriBuilder.path("/animais/{id}").buildAndExpand(animalCadastrado.id()).toUri();
        return ResponseEntity.created(uri).body(animalCadastrado);
    }

    @GetMapping
    public ResponseEntity<List<AnimalDetalhesDTO>> listar(@AuthenticationPrincipal Usuario usuarioLogado) {
        List<AnimalDetalhesDTO> lista = animalService.listarAnimaisDoUsuario(usuarioLogado.getId());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalDetalhesDTO> detalhar(@PathVariable Long id, @AuthenticationPrincipal Usuario usuarioLogado) {
        AnimalDetalhesDTO animal = animalService.detalharAnimal(id, usuarioLogado.getId());
        return ResponseEntity.ok(animal);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnimalDetalhesDTO> atualizar(@PathVariable Long id,
                                                       @RequestBody @Valid AnimalCadastroDTO dados,
                                                       @AuthenticationPrincipal Usuario usuarioLogado) {
        AnimalDetalhesDTO animalAtualizado = animalService.atualizarAnimal(id, dados, usuarioLogado.getId());
        return ResponseEntity.ok(animalAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id, @AuthenticationPrincipal Usuario usuarioLogado) {
        animalService.deletarAnimal(id, usuarioLogado.getId());
        return ResponseEntity.noContent().build();
    }
}
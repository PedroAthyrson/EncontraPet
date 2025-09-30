package br.com.encontrapet.api.controller;

import br.com.encontrapet.api.dto.AnimalCadastroDTO;
import br.com.encontrapet.api.dto.AnimalDetalhesDTO;
import br.com.encontrapet.api.model.Usuario;
import br.com.encontrapet.api.service.AnimalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Animais", description = "Gerenciamento dos animais de estimação do usuário logado")
@SecurityRequirement(name = "bearer-key")
public class AnimalController {

    @Autowired
    private AnimalService animalService;

    @PostMapping
    @Operation(summary = "Cadastra um novo animal", description = "Cria um novo registro de animal associado ao usuário autenticado.")
    public ResponseEntity<AnimalDetalhesDTO> cadastrar(@RequestBody @Valid AnimalCadastroDTO dados,
                                                       @AuthenticationPrincipal Usuario usuarioLogado,
                                                       UriComponentsBuilder uriBuilder) {
        AnimalDetalhesDTO animalCadastrado = animalService.cadastrarAnimal(dados, usuarioLogado);
        URI uri = uriBuilder.path("/animais/{id}").buildAndExpand(animalCadastrado.id()).toUri();
        return ResponseEntity.created(uri).body(animalCadastrado);
    }

    @GetMapping
    @Operation(summary = "Lista os animais do usuário", description = "Retorna uma lista de todos os animais de estimação cadastrados pelo usuário autenticado.")
    public ResponseEntity<List<AnimalDetalhesDTO>> listar(@AuthenticationPrincipal Usuario usuarioLogado) {
        List<AnimalDetalhesDTO> lista = animalService.listarAnimaisDoUsuario(usuarioLogado.getId());
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalha um animal", description = "Busca e retorna os detalhes de um animal específico pelo seu ID. Apenas o dono do animal pode acessá-lo.")
    public ResponseEntity<AnimalDetalhesDTO> detalhar(@Parameter(description = "ID do animal a ser detalhado") @PathVariable Long id,
                                                      @AuthenticationPrincipal Usuario usuarioLogado) {
        AnimalDetalhesDTO animal = animalService.detalharAnimal(id, usuarioLogado.getId());
        return ResponseEntity.ok(animal);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza um animal", description = "Modifica os dados de um animal de estimação existente. Apenas o dono do animal pode atualizá-lo.")
    public ResponseEntity<AnimalDetalhesDTO> atualizar(@Parameter(description = "ID do animal a ser atualizado") @PathVariable Long id,
                                                       @RequestBody @Valid AnimalCadastroDTO dados,
                                                       @AuthenticationPrincipal Usuario usuarioLogado) {
        AnimalDetalhesDTO animalAtualizado = animalService.atualizarAnimal(id, dados, usuarioLogado.getId());
        return ResponseEntity.ok(animalAtualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deleta um animal", description = "Remove o registro de um animal de estimação. Apenas o dono do animal pode deletá-lo.")
    public ResponseEntity<Void> deletar(@Parameter(description = "ID do animal a ser deletado") @PathVariable Long id,
                                        @AuthenticationPrincipal Usuario usuarioLogado) {
        animalService.deletarAnimal(id, usuarioLogado.getId());
        return ResponseEntity.noContent().build();
    }
}
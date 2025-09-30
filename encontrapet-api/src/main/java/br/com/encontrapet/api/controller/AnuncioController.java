package br.com.encontrapet.api.controller;

import br.com.encontrapet.api.dto.AnuncioCadastroDTO;
import br.com.encontrapet.api.dto.AnuncioDetalhesDTO;
import br.com.encontrapet.api.model.StatusAnuncio;
import br.com.encontrapet.api.model.Usuario;
import br.com.encontrapet.api.service.AnuncioService;
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
@RequestMapping("/anuncios")
@Tag(name = "Anúncios", description = "Operações para criar, buscar e gerenciar anúncios de pets")
public class AnuncioController {

    @Autowired
    private AnuncioService anuncioService;

    @PostMapping
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Cria um novo anúncio", description = "Cria um anúncio de animal perdido ou encontrado. Requer autenticação.")
    public ResponseEntity<AnuncioDetalhesDTO> criar(@RequestBody @Valid AnuncioCadastroDTO dados,
                                                    @AuthenticationPrincipal Usuario usuarioLogado,
                                                    UriComponentsBuilder uriBuilder) {
        AnuncioDetalhesDTO anuncioCriado = anuncioService.criarAnuncio(dados, usuarioLogado);
        URI uri = uriBuilder.path("/anuncios/{id}").buildAndExpand(anuncioCriado.id()).toUri();
        return ResponseEntity.created(uri).body(anuncioCriado);
    }

    @GetMapping
    @Operation(summary = "Lista e filtra anúncios", description = "Endpoint público para listar todos os anúncios. Permite filtrar por status, cidade e/ou estado.")
    public ResponseEntity<List<AnuncioDetalhesDTO>> listar(
            @Parameter(description = "Filtrar por status do anúncio (PERDIDO, ENCONTRADO, RESOLVIDO)") @RequestParam(required = false) StatusAnuncio status,
            @Parameter(description = "Filtrar por nome da cidade (busca parcial, case-insensitive)") @RequestParam(required = false) String cidade,
            @Parameter(description = "Filtrar pela sigla do estado (ex: PB)") @RequestParam(required = false) String estado
    ) {
        List<AnuncioDetalhesDTO> anuncios = anuncioService.listar(status, cidade, estado);
        return ResponseEntity.ok(anuncios);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Detalha um anúncio", description = "Endpoint público para buscar os detalhes completos de um anúncio pelo seu ID.")
    public ResponseEntity<AnuncioDetalhesDTO> detalhar(@PathVariable Long id) {
        AnuncioDetalhesDTO anuncio = anuncioService.detalharAnuncio(id);
        return ResponseEntity.ok(anuncio);
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Atualiza um anúncio", description = "Permite que o criador do anúncio atualize suas informações. Não é possível editar anúncios resolvidos. Requer autenticação.")
    public ResponseEntity<AnuncioDetalhesDTO> atualizar(@PathVariable Long id,
                                                        @RequestBody @Valid AnuncioCadastroDTO dados,
                                                        @AuthenticationPrincipal Usuario usuarioLogado) {
        AnuncioDetalhesDTO anuncioAtualizado = anuncioService.atualizarAnuncio(id, dados, usuarioLogado);
        return ResponseEntity.ok(anuncioAtualizado);
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Deleta um anúncio", description = "Permite que o criador do anúncio o remova do sistema. Requer autenticação.")
    public ResponseEntity<Void> deletar(@PathVariable Long id,
                                        @AuthenticationPrincipal Usuario usuarioLogado) {
        anuncioService.deletarAnuncio(id, usuarioLogado);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/resolver")
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Marca um anúncio como 'Resolvido'", description = "Altera o status de um anúncio para RESOLVIDO. Apenas o criador do anúncio pode realizar esta ação. Requer autenticação.")
    public ResponseEntity<AnuncioDetalhesDTO> marcarComoResolvido(@PathVariable Long id,
                                                                  @AuthenticationPrincipal Usuario usuarioLogado) {
        AnuncioDetalhesDTO anuncioResolvido = anuncioService.marcarComoResolvido(id, usuarioLogado);
        return ResponseEntity.ok(anuncioResolvido);
    }
}
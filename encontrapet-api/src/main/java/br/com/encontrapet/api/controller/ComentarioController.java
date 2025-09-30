package br.com.encontrapet.api.controller;

import br.com.encontrapet.api.dto.ComentarioCadastroDTO;
import br.com.encontrapet.api.dto.ComentarioDetalhesDTO;
import br.com.encontrapet.api.model.Usuario;
import br.com.encontrapet.api.service.ComentarioService;
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
@RequestMapping("/anuncios/{anuncioId}/comentarios")
@Tag(name = "Comentários", description = "Operações para adicionar e listar comentários em anúncios")
public class ComentarioController {

    @Autowired
    private ComentarioService comentarioService;

    @PostMapping
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Adiciona um novo comentário", description = "Permite que um usuário autenticado adicione um comentário a um anúncio específico. Requer autenticação.")
    public ResponseEntity<ComentarioDetalhesDTO> comentar(@Parameter(description = "ID do anúncio que está sendo comentado") @PathVariable Long anuncioId,
                                                          @RequestBody @Valid ComentarioCadastroDTO dados,
                                                          @AuthenticationPrincipal Usuario usuarioLogado,
                                                          UriComponentsBuilder uriBuilder) {
        ComentarioDetalhesDTO comentario = comentarioService.criarComentario(anuncioId, dados, usuarioLogado);
        URI uri = uriBuilder.path("/anuncios/{anuncioId}/comentarios/{comentarioId}")
                .buildAndExpand(anuncioId, comentario.id()).toUri();
        return ResponseEntity.created(uri).body(comentario);
    }

    @GetMapping
    @Operation(summary = "Lista os comentários de um anúncio", description = "Endpoint público para listar todos os comentários de um anúncio específico, ordenados do mais recente para o mais antigo.")
    public ResponseEntity<List<ComentarioDetalhesDTO>> listar(@Parameter(description = "ID do anúncio para o qual os comentários serão listados") @PathVariable Long anuncioId) {
        List<ComentarioDetalhesDTO> comentarios = comentarioService.listarComentariosPorAnuncio(anuncioId);
        return ResponseEntity.ok(comentarios);
    }
}
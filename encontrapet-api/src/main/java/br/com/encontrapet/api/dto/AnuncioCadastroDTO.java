package br.com.encontrapet.api.dto;

import br.com.encontrapet.api.model.StatusAnuncio;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AnuncioCadastroDTO(
        @NotBlank String titulo,
        @NotBlank String descricaoEvento,
        @NotNull StatusAnuncio status,
        @NotBlank String cidade,
        @NotBlank String estado,

        Long idAnimal,
        String animalEncontradoDescricao,
        String animalEncontradoFotoUrl
) {
}
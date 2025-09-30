package br.com.encontrapet.api.dto;

import jakarta.validation.constraints.NotBlank;

public record ComentarioCadastroDTO(
        @NotBlank(message = "O texto do comentário não pode estar em branco.")
        String texto
) {
}
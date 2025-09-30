package br.com.encontrapet.api.dto;

import jakarta.validation.constraints.NotBlank;

public record AnimalCadastroDTO(
        @NotBlank String nome,
        @NotBlank String especie,
        String raca,
        String cor,
        String fotoUrl
) {
}
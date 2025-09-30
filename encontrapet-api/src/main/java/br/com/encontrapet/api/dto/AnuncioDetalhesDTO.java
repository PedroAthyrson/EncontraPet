package br.com.encontrapet.api.dto;

import br.com.encontrapet.api.model.Anuncio;
import br.com.encontrapet.api.model.StatusAnuncio;

import java.time.LocalDateTime;

public record AnuncioDetalhesDTO(
        Long id,
        String titulo,
        String descricaoEvento,
        StatusAnuncio status,
        LocalDateTime dataCriacao,
        String cidade,
        String estado,
        Long idUsuario,
        String nomeUsuario,
        AnimalDetalhesDTO animal,
        String animalEncontradoDescricao,
        String animalEncontradoFotoUrl
) {
    public AnuncioDetalhesDTO(Anuncio anuncio) {
        this(
                anuncio.getId(),
                anuncio.getTitulo(),
                anuncio.getDescricaoEvento(),
                anuncio.getStatus(),
                anuncio.getDataCriacao(),
                anuncio.getCidade(),
                anuncio.getEstado(),
                anuncio.getUsuario().getId(),
                anuncio.getUsuario().getNome(),
                anuncio.getAnimal() != null ? new AnimalDetalhesDTO(anuncio.getAnimal()) : null,
                anuncio.getAnimalEncontradoDescricao(),
                anuncio.getAnimalEncontradoFotoUrl()
        );
    }
}
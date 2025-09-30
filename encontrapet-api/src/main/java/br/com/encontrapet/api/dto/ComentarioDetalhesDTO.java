package br.com.encontrapet.api.dto;

import br.com.encontrapet.api.model.Comentario;

import java.time.LocalDateTime;

public record ComentarioDetalhesDTO(
        Long id,
        String texto,
        LocalDateTime dataCriacao,
        Long idUsuario,
        String nomeUsuario
) {
    public ComentarioDetalhesDTO(Comentario comentario) {
        this(
                comentario.getId(),
                comentario.getTexto(),
                comentario.getDataCriacao(),
                comentario.getUsuario().getId(),
                comentario.getUsuario().getNome()
        );
    }
}
package br.com.encontrapet.api.dto;

import org.springframework.validation.FieldError;

public record ErroDTO(String campo, String mensagem) {

    public ErroDTO(FieldError erro) {
        this(erro.getField(), erro.getDefaultMessage());
    }
}
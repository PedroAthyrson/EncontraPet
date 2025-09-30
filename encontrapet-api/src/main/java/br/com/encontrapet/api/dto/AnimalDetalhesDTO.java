package br.com.encontrapet.api.dto;

import br.com.encontrapet.api.model.Animal;

public record AnimalDetalhesDTO(
        Long id,
        String nome,
        String especie,
        String raca,
        String cor,
        String fotoUrl
) {
    public AnimalDetalhesDTO(Animal animal) {
        this(
                animal.getId(),
                animal.getNome(),
                animal.getEspecie(),
                animal.getRaca(),
                animal.getCor(),
                animal.getFotoUrl()
        );
    }
}
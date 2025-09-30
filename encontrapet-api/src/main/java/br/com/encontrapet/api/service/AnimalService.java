package br.com.encontrapet.api.service;

import br.com.encontrapet.api.dto.AnimalCadastroDTO;
import br.com.encontrapet.api.dto.AnimalDetalhesDTO;
import br.com.encontrapet.api.model.Animal;
import br.com.encontrapet.api.model.Usuario;
import br.com.encontrapet.api.repository.AnimalRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnimalService {

    @Autowired
    private AnimalRepository animalRepository;

    @Transactional
    public AnimalDetalhesDTO cadastrarAnimal(AnimalCadastroDTO dados, Usuario usuarioLogado) {
        Animal novoAnimal = new Animal();
        novoAnimal.setNome(dados.nome());
        novoAnimal.setEspecie(dados.especie());
        novoAnimal.setRaca(dados.raca());
        novoAnimal.setCor(dados.cor());
        novoAnimal.setFotoUrl(dados.fotoUrl());
        novoAnimal.setUsuario(usuarioLogado);

        animalRepository.save(novoAnimal);
        return new AnimalDetalhesDTO(novoAnimal);
    }

    public List<AnimalDetalhesDTO> listarAnimaisDoUsuario(Long idUsuario) {
        return animalRepository.findByUsuarioId(idUsuario).stream()
                .map(AnimalDetalhesDTO::new)
                .collect(Collectors.toList());
    }

    public AnimalDetalhesDTO detalharAnimal(Long id, Long idUsuario) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Animal não encontrado"));

        if (!animal.getUsuario().getId().equals(idUsuario)) {
            throw new SecurityException("Acesso negado: este animal não pertence ao usuário logado.");
        }

        return new AnimalDetalhesDTO(animal);
    }

    @Transactional
    public AnimalDetalhesDTO atualizarAnimal(Long id, @Valid AnimalCadastroDTO dados, Long idUsuario) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Animal não encontrado"));

        if (!animal.getUsuario().getId().equals(idUsuario)) {
            throw new SecurityException("Acesso negado: este animal não pertence ao usuário logado.");
        }

        animal.setNome(dados.nome());
        animal.setEspecie(dados.especie());
        animal.setRaca(dados.raca());
        animal.setCor(dados.cor());
        animal.setFotoUrl(dados.fotoUrl());

        return new AnimalDetalhesDTO(animal);
    }

    @Transactional
    public void deletarAnimal(Long id, Long idUsuario) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Animal não encontrado"));

        if (!animal.getUsuario().getId().equals(idUsuario)) {
            throw new SecurityException("Acesso negado: este animal não pertence ao usuário logado.");
        }

        animalRepository.delete(animal);
    }
}
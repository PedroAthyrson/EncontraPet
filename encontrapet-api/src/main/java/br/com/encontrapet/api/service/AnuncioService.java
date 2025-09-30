package br.com.encontrapet.api.service;

import br.com.encontrapet.api.dto.AnuncioCadastroDTO;
import br.com.encontrapet.api.dto.AnuncioDetalhesDTO;
import br.com.encontrapet.api.model.Anuncio;
import br.com.encontrapet.api.model.StatusAnuncio;
import br.com.encontrapet.api.model.Usuario;
import br.com.encontrapet.api.repository.AnimalRepository;
import br.com.encontrapet.api.repository.AnuncioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnuncioService {

    @Autowired
    private AnuncioRepository anuncioRepository;
    @Autowired
    private AnimalRepository animalRepository;

    @Transactional
    public AnuncioDetalhesDTO criarAnuncio(AnuncioCadastroDTO dados, Usuario usuarioLogado) {
        Anuncio novoAnuncio = new Anuncio();
        novoAnuncio.setTitulo(dados.titulo());
        novoAnuncio.setDescricaoEvento(dados.descricaoEvento());
        novoAnuncio.setStatus(dados.status());
        novoAnuncio.setCidade(dados.cidade());
        novoAnuncio.setEstado(dados.estado());
        novoAnuncio.setUsuario(usuarioLogado);

        if (dados.status() == StatusAnuncio.PERDIDO) {
            if (dados.idAnimal() == null) {
                throw new IllegalArgumentException("Para um anúncio de animal perdido, o ID do animal é obrigatório.");
            }
            var animal = animalRepository.findById(dados.idAnimal())
                    .orElseThrow(() -> new EntityNotFoundException("Animal com ID " + dados.idAnimal() + " não encontrado."));
            if (!animal.getUsuario().getId().equals(usuarioLogado.getId())) {
                throw new SecurityException("Acesso negado: você só pode criar anúncios para seus próprios animais.");
            }
            novoAnuncio.setAnimal(animal);
        } else if (dados.status() == StatusAnuncio.ENCONTRADO) {
            novoAnuncio.setAnimalEncontradoDescricao(dados.animalEncontradoDescricao());
            novoAnuncio.setAnimalEncontradoFotoUrl(dados.animalEncontradoFotoUrl());
        }

        anuncioRepository.save(novoAnuncio);
        return new AnuncioDetalhesDTO(novoAnuncio);
    }

    public List<AnuncioDetalhesDTO> listarTodos() {
        return anuncioRepository.findAll().stream()
                .map(AnuncioDetalhesDTO::new)
                .collect(Collectors.toList());
    }

    public AnuncioDetalhesDTO detalharAnuncio(Long id) {
        Anuncio anuncio = anuncioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Anúncio não encontrado."));
        return new AnuncioDetalhesDTO(anuncio);
    }

    @Transactional
    public AnuncioDetalhesDTO marcarComoResolvido(Long id, Usuario usuarioLogado) {
        Anuncio anuncio = anuncioRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Anúncio não encontrado."));

        if (!anuncio.getUsuario().getId().equals(usuarioLogado.getId())) {
            throw new SecurityException("Acesso negado: você só pode alterar seus próprios anúncios.");
        }

        anuncio.setStatus(StatusAnuncio.RESOLVIDO);
        return new AnuncioDetalhesDTO(anuncio);
    }
}
package br.com.encontrapet.api.service;

import br.com.encontrapet.api.dto.ComentarioCadastroDTO;
import br.com.encontrapet.api.dto.ComentarioDetalhesDTO;
import br.com.encontrapet.api.model.Comentario;
import br.com.encontrapet.api.model.Usuario;
import br.com.encontrapet.api.repository.AnuncioRepository;
import br.com.encontrapet.api.repository.ComentarioRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;
    @Autowired
    private AnuncioRepository anuncioRepository;

    @Transactional
    public ComentarioDetalhesDTO criarComentario(Long anuncioId, ComentarioCadastroDTO dados, Usuario usuarioLogado) {
        var anuncio = anuncioRepository.findById(anuncioId)
                .orElseThrow(() -> new EntityNotFoundException("Anúncio com ID " + anuncioId + " não encontrado."));

        Comentario novoComentario = new Comentario();
        novoComentario.setTexto(dados.texto());
        novoComentario.setAnuncio(anuncio);
        novoComentario.setUsuario(usuarioLogado);

        comentarioRepository.save(novoComentario);
        return new ComentarioDetalhesDTO(novoComentario);
    }

    public List<ComentarioDetalhesDTO> listarComentariosPorAnuncio(Long anuncioId) {
        if (!anuncioRepository.existsById(anuncioId)) {
            throw new EntityNotFoundException("Anúncio com ID " + anuncioId + " não encontrado.");
        }

        return comentarioRepository.findByAnuncioIdOrderByDataCriacaoDesc(anuncioId).stream()
                .map(ComentarioDetalhesDTO::new)
                .collect(Collectors.toList());
    }
}
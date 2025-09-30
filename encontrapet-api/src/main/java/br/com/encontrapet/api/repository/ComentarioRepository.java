package br.com.encontrapet.api.repository;

import br.com.encontrapet.api.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Long> {
    List<Comentario> findByAnuncioIdOrderByDataCriacaoDesc(Long anuncioId);
}
package br.com.encontrapet.api.repository;

import br.com.encontrapet.api.model.Anuncio;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {

}
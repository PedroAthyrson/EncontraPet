package br.com.encontrapet.api.repository;

import br.com.encontrapet.api.model.Anuncio;
import br.com.encontrapet.api.model.StatusAnuncio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AnuncioRepository extends JpaRepository<Anuncio, Long> {

    @Query("""
        SELECT a FROM Anuncio a
        WHERE (:status IS NULL OR a.status = :status)
        AND (:cidade IS NULL OR a.cidade ILIKE %:cidade%)
        AND (:estado IS NULL OR a.estado ILIKE %:estado%)
    """)
    List<Anuncio> findWithFilters(
            @Param("status") StatusAnuncio status,
            @Param("cidade") String cidade,
            @Param("estado") String estado
    );
}
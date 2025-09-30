package br.com.encontrapet.api.repository;

import br.com.encontrapet.api.model.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnimalRepository extends JpaRepository<Animal, Long> {
    List<Animal> findByUsuarioId(Long idUsuario);
}
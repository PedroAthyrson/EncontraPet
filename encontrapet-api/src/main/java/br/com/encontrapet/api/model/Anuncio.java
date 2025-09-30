package br.com.encontrapet.api.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Entity
@Table(name = "anuncios")
@Data
@EqualsAndHashCode(of = "id")
public class Anuncio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(name = "descricao_evento", columnDefinition = "TEXT")
    private String descricaoEvento;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusAnuncio status;

    @Column(name = "data_criacao", updatable = false)
    private LocalDateTime dataCriacao;

    @Column(nullable = false)
    private String cidade;

    @Column(nullable = false)
    private String estado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario; // Quem criou o anúncio

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_animal")
    private Animal animal;

    @Column(name = "animal_encontrado_descricao", columnDefinition = "TEXT")
    private String animalEncontradoDescricao;

    @Column(name = "animal_encontrado_foto_url")
    private String animalEncontradoFotoUrl;


    @PrePersist
    protected void onCreate() {
        dataCriacao = LocalDateTime.now();
    }
}
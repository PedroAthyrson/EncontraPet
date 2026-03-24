package br.com.encontrapet.api.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/upload")
public class UploadController {
    private final String UPLOAD_DIR = "uploads/";
    @PostMapping
    @SecurityRequirement(name = "bearer-key")
    public ResponseEntity<?> uploadImagem(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Arquivo vazio.");
        }

        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replaceAll("\\s+", "_");
            Path path = Paths.get(UPLOAD_DIR + fileName);

            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
            String fileUrl = "http://localhost:8080/api/uploads/" + fileName;

            return ResponseEntity.ok(Map.of("url", fileUrl));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erro ao salvar a imagem.");
        }
    }
}
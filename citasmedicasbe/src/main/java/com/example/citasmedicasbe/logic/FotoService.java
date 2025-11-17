package com.example.citasmedicasbe.logic;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class FotoService {

    @Value("${picturesPath}")
    private String picturesPath;

    private static final List<String> EXTENSIONES_PERMITIDAS = List.of(".jpg", ".jpeg", ".png", ".gif");

    public String guardarFoto(String userId, MultipartFile photo) throws Exception {
        if (photo == null || photo.isEmpty()) {
            return null;
        }

        String originalFilename = photo.getOriginalFilename();
        String extension = "";

        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
        }

        if (!EXTENSIONES_PERMITIDAS.contains(extension)) {
            throw new IllegalArgumentException("Formato de imagen no permitido.");
        }

        // Crear directorio si no existe
        Path dirPath = Paths.get(picturesPath);
        if (!Files.exists(dirPath)) {
            Files.createDirectories(dirPath);
        }

        // Eliminar imagen anterior que tenga el mismo nombre base (userId)
        Files.list(dirPath)
                .filter(path -> path.getFileName().toString().startsWith(userId + "."))
                .forEach(path -> {
                    try {
                        Files.delete(path);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                });

        // Guardar nueva imagen
        String fileName = userId + extension;
        Path destinationPath = dirPath.resolve(fileName);
        photo.transferTo(destinationPath.toFile());

        return fileName;
    }

}


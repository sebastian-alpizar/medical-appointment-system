package com.example.citasmedicasbe.presentation;

import com.example.citasmedicasbe.logic.UsuarioService;
import com.example.citasmedicasbe.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    UsuarioService usuarioService;

    @Value("${picturesPath}")
    private String picturesPath;

    @PostMapping("/register")
    public boolean save(@RequestParam String id,
                     @RequestParam String nombre,
                     @RequestParam String password,
                     @RequestParam String rol,
                     @RequestParam(required = false) MultipartFile photo) throws IOException {

        return usuarioService.register(id, nombre, password, rol, photo);
    }

    @GetMapping("/photo/{id}")
    public ResponseEntity<Resource> photo(@PathVariable String id) throws Exception {
        List<String> extensiones = List.of(".jpg", ".jpeg", ".png", ".gif");
        Resource resource = null;
        Path path = null;
        for (String ext : extensiones) {
            path = Paths.get(picturesPath + id + ext);
            if (Files.exists(path)) {
                resource = new UrlResource(path.toUri());
                break;
            }
        }
        String contentType = Files.probeContentType(path);
        if (contentType == null) {
            contentType = "application/octet-stream";
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> filtro) {
        String id = filtro.get("id");
        String password = filtro.get("password");
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(id, password));
        return tokenService.generateToken(authentication);
    }
}

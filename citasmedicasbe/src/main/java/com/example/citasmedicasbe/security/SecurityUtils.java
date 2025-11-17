package com.example.citasmedicasbe.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public String getAuthenticatedUserId() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return jwt.getClaimAsString("id"); // Asume que el claim del ID es "id"
    }

    // Opcional: Método para obtener el usuario completo si necesitas más datos
    public Jwt getAuthenticatedUser() {
        return (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
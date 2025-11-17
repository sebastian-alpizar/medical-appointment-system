package com.example.citasmedicasbe.security;

import com.example.citasmedicasbe.logic.Usuario;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AllArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TokenService {
    private final JwtConfig jwtConfig;

    public String generateToken(Authentication authentication) {
        Instant now = Instant.now();

        Usuario usuario = (Usuario) authentication.getPrincipal();

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .issuer("TotalSoft")
                .issueTime(Date.from(now))
                .expirationTime(Date.from(now.plusMillis(jwtConfig.getJwtExpiration())))
                .subject(usuario.getUsername())
                .claim("id", usuario.getId())
                .claim("name", usuario.getNombre())
                .claim("scope", authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList()))
                .build();

        try {
            SignedJWT jwt = new SignedJWT(
                    new JWSHeader.Builder(JWSAlgorithm.HS256).build(),
                    claims
            );
            jwt.sign(new MACSigner(jwtConfig.getSecretKey()));
            return jwt.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException("Error al generar JWT", e);
        }
    }
}

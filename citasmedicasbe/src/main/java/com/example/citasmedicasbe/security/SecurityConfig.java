package com.example.citasmedicasbe.security;

import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import java.util.Arrays;

@Configuration
@AllArgsConstructor
public class SecurityConfig {
    private final JwtConfig jwtConfig;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Desactiva la protección CSRF (útil para APIs REST)
                .csrf(AbstractHttpConfigurer::disable)

                // Configura CORS para permitir peticiones desde el frontend
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration configuration = new CorsConfiguration();
                    // Permite solicitudes desde el frontend (React)
                    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
                    // Métodos HTTP permitidos
                    configuration.setAllowedMethods(Arrays.asList("GET","POST", "PUT", "DELETE", "OPTIONS"));
                    // Cabeceras HTTP permitidas
                    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
                    return configuration;
                }))

                // Indica que no se debe crear sesión en el servidor (uso de JWT)
                .sessionManagement(sessionManagement -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Define las reglas de autorización para distintas rutas
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        // Permite el acceso libre a las rutas que empiezan con /usuarios/
                        .requestMatchers("/usuarios/**").permitAll()

                        // Solo usuarios con scope "PACIENTE" pueden acceder a /citas/save/**
                        .requestMatchers(
                                "/citas/save",
                                "/citas/statusAndMedico"
                        ).hasAuthority("SCOPE_PACIENTE")

                        // Solo usuarios con scope "ADM" pueden acceder a /medicos/**
                        .requestMatchers(
                                "/medicos/espera",
                                "/medicos/accept",
                                "/medicos/delete"
                        ).hasAuthority("SCOPE_ADMIN")

                        // Solo usuarios con scope "MEDICO" pueden acceder a /medicos/**
                        .requestMatchers(
                                "/citas/addNota",
                                "/citas/statusAndPaciente",
                                "/citas/delete",
                                "/citas/accept",
                                "/medicos/update"
                        ).hasAuthority("SCOPE_MEDICO")

                        // Cualquier otra petición será permitida sin autenticación
                        .anyRequest().permitAll()
                )

                // Configura el servidor para validar los JWT como método de autenticación
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt
                                .decoder(jwtDecoder())
                                .jwtAuthenticationConverter(jwtAuthenticationConverter())
                        )
                )

                // Construye y devuelve la cadena de filtros
                .build();
    }

    // Define cómo se decodifican los JWT usando una clave secreta
    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withSecretKey(jwtConfig.getSecretKey()).build();
    }

    // Codificador de contraseñas usando BCrypt (para guardar y verificar contraseñas de usuarios)
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Define el gestor de autenticación general que usará el proveedor personalizado
    @Bean
    public AuthenticationManager authManager(AuthenticationProvider authenticationProvider) {
        return new ProviderManager(authenticationProvider);
    }

    // Define el proveedor de autenticación que usa el servicio de usuarios y el codificador de contraseñas
    @Bean
    AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        // Servicio que carga el usuario desde la base de datos
        authProvider.setUserDetailsService(customUserDetailsService);
        // Compara contraseñas usando BCrypt
        authProvider.setPasswordEncoder(passwordEncoder());
        authProvider.setHideUserNotFoundExceptions(false);
        return authProvider;
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter converter = new JwtGrantedAuthoritiesConverter();
        converter.setAuthorityPrefix("SCOPE_");
        converter.setAuthoritiesClaimName("scope");

        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(converter);
        return jwtConverter;
    }
}



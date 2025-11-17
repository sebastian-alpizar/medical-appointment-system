package com.example.citasmedicasbe.data;

import com.example.citasmedicasbe.logic.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    public Optional<Usuario> findById(String IdUsuario);
}

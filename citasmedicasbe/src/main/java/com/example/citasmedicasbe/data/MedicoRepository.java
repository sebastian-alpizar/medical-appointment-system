package com.example.citasmedicasbe.data;

import com.example.citasmedicasbe.logic.Medico;
import com.example.citasmedicasbe.logic.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface MedicoRepository extends JpaRepository<Medico, String> {
    List<Medico> findByEspecialidadIgnoreCaseAndAceptadoTrue(String especialidad);
    List<Medico> findByUbicacionIgnoreCaseAndAceptadoTrue(String ubicacion);
    List<Medico> findByEspecialidadAndUbicacionIgnoreCaseAndAceptadoTrue(String especialidad, String ubicacion);
    List<Medico> findByAceptadoTrue();
    List<Medico> findByAceptadoFalse();
    Optional<Medico> findByIdUsuario(Usuario usuario);
}

package com.example.citasmedicasbe.security;

import com.example.citasmedicasbe.data.MedicoRepository;
import com.example.citasmedicasbe.data.UsuarioRepository;
import com.example.citasmedicasbe.logic.Medico;
import com.example.citasmedicasbe.logic.Usuario;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final MedicoRepository medicoRepository;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        if ("MEDICO".equalsIgnoreCase(usuario.getRol())) {
            Medico medico = medicoRepository.findByIdUsuario(usuario)
                    .orElseThrow(() -> new UsernameNotFoundException("Médico no registrado"));
            usuario.setMedicoAceptado(medico.getAceptado());
        }else{
            System.out.println("Roooooool" + usuario.getRol());
        }

        return usuario;
    }
}

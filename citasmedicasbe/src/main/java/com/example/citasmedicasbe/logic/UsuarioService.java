package com.example.citasmedicasbe.logic;

import com.example.citasmedicasbe.data.AdminRepository;
import com.example.citasmedicasbe.data.MedicoRepository;
import com.example.citasmedicasbe.data.PacienteRepository;
import com.example.citasmedicasbe.data.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.multipart.MultipartFile;

@org.springframework.stereotype.Service("usuarioService")
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FotoService fotoService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    PacienteRepository pacienteRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private AdminRepository adminRepository;

    public boolean register(String id, String nombre, String password, String rol, MultipartFile photo) {
        if (usuarioRepository.existsById(id)) {
            return false;
        }
        if (photo != null) {
            try {
                String foto = fotoService.guardarFoto(id, photo);
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        }

        Usuario usuario = new Usuario();
        usuario.setId(id);
        usuario.setNombre(nombre);
        usuario.setClave(passwordEncoder.encode(password));
        usuario.setRol(rol);
        usuarioRepository.save(usuario);

        Object usuarioRol = null;
        switch (rol) {
            case "PACIENTE":
                usuarioRol = new Paciente();
                Paciente paciente = (Paciente) usuarioRol;
                paciente.setNombre(nombre);
                paciente.setId(id);
                paciente.setIdUsuario(usuario);
                pacienteRepository.save(paciente);
                break;
            case "MEDICO":
                usuarioRol = new Medico();
                Medico medico = (Medico) usuarioRol;
                medico.setNombre(nombre);
                medico.setId(id);
                medico.setIdUsuario(usuario);
                medico.setAceptado(false);
                medicoRepository.save(medico);
                break;
            case "ADMIN":
                usuarioRol = new Admin();
                Admin admin = (Admin) usuarioRol;
                admin.setNombre(nombre);
                admin.setId(id);
                admin.setIdUsuario(usuario);
                adminRepository.save(admin);
                break;
        }
        return true;
    }
}
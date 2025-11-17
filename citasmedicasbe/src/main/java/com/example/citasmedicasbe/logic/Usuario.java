package com.example.citasmedicasbe.logic;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;
import java.util.List;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "usuarios")
public class Usuario implements UserDetails {
    @Id
    @Size(max = 50)
    @Column(name = "id", nullable = false, length = 50)
    private String id;

    @Size(max = 500)
    @Column(name = "nombre", length = 500)
    private String nombre;

    @Size(max = 255)
    @NotNull
    @Column(name = "clave", nullable = false)
    private String clave;

    @NotNull
    @Lob
    @Column(name = "rol", nullable = false)
    private String rol;

    @OneToMany(mappedBy = "idUsuario")
    private Set<Admin> admins = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idUsuario")
    private Set<Medico> medicos = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idUsuario")
    private Set<Paciente> pacientes = new LinkedHashSet<>();

    @Transient // No se persiste, se calcula dinámicamente
    private Boolean medicoAceptado;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getClave() {
        return clave;
    }

    public void setClave(String clave) {
        this.clave = clave;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Set<Admin> getAdmins() {
        return admins;
    }

    public void setAdmins(Set<Admin> admins) {
        this.admins = admins;
    }

    public Set<Medico> getMedicos() {
        return medicos;
    }

    public void setMedicos(Set<Medico> medicos) {
        this.medicos = medicos;
    }

    public Set<Paciente> getPacientes() {
        return pacientes;
    }

    public void setPacientes(Set<Paciente> pacientes) {
        this.pacientes = pacientes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convierte el string rol (ejemplo: "ROLE_ADM") en lista con un solo GrantedAuthority
        return List.of(new SimpleGrantedAuthority(rol));
    }

    @Override
    public String getPassword() {
        return clave;
    }

    @Override
    public String getUsername() {
        return id;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // por defecto
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // por defecto
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // por defecto
    }

    @Override
    public boolean isEnabled() {
        // Si no es médico, está habilitado
        if (!"MEDICO".equals(this.rol)) {
            return true;
        }
        // Si es médico, depende de si está aceptado
        return medicoAceptado != null && medicoAceptado;
    }

    public void setMedicoAceptado(Boolean aceptado) {
        this.medicoAceptado = aceptado;
    }
}
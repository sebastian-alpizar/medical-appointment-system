package com.example.citasmedicasbe.logic;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "medicos")
public class Medico {
    @Id
    @Size(max = 50)
    @Column(name = "id", nullable = false, length = 50)
    private String id;

    @Size(max = 100)
    @NotNull
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "id_usuario", nullable = false)
    @JsonIgnore
    private Usuario idUsuario;

    @Column(name = "costo_consulta", precision = 10, scale = 2)
    private BigDecimal costoConsulta;

    @Column(name = "frecuencia_cita")
    private Integer frecuenciaCita;

    @Size(max = 100)
    @Column(name = "especialidad", length = 100)
    private String especialidad;

    @Size(max = 50)
    @Column(name = "ubicacion", length = 50)
    private String ubicacion;

    @Size(max = 50)
    @Column(name = "hospital", length = 50)
    private String hospital;

    @OneToMany(mappedBy = "idMedico")
    @JsonIgnore
    private Set<Cita> citas = new LinkedHashSet<>();

    @OneToMany(mappedBy = "idMedico")
    @JsonIgnore
    private Set<HorariosMedico> horariosMedicos = new LinkedHashSet<>();

    @ColumnDefault("0")
    @Column(name = "aceptado")
    private Boolean aceptado;

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

    public Usuario getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Usuario idUsuario) {
        this.idUsuario = idUsuario;
    }

    public BigDecimal getCostoConsulta() {
        return costoConsulta;
    }

    public void setCostoConsulta(BigDecimal costoConsulta) {
        this.costoConsulta = costoConsulta;
    }

    public Integer getFrecuenciaCita() {
        return frecuenciaCita;
    }

    public void setFrecuenciaCita(Integer frecuenciaCita) {
        this.frecuenciaCita = frecuenciaCita;
    }

    public String getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(String especialidad) {
        this.especialidad = especialidad;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public String getHospital() {
        return hospital;
    }

    public void setHospital(String hospital) {
        this.hospital = hospital;
    }

    public Set<Cita> getCitas() {
        return citas;
    }

    public void setCitas(Set<Cita> citas) {
        this.citas = citas;
    }

    public Set<HorariosMedico> getHorariosMedicos() {
        return horariosMedicos;
    }

    public void setHorariosMedicos(Set<HorariosMedico> horariosMedicos) {
        this.horariosMedicos = horariosMedicos;
    }

    public Boolean getAceptado() {
        return aceptado;
    }

    public void setAceptado(Boolean aceptado) {
        this.aceptado = aceptado;
    }
}
package com.example.citasmedicasbe.logic;

import com.example.citasmedicasbe.data.MedicoRepository;
import com.example.citasmedicasbe.data.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

@org.springframework.stereotype.Service("medicoService")
public class MedicoService {
    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    FotoService fotoService;

    @Autowired
    private HorariosMedicoService horariosMedicoService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Medico> buscarPorEspecialidadYUbicacion(String especialidad, String ubicacion) {
        List<Medico> resultado;
        if ((especialidad == null || especialidad.isEmpty()) && (ubicacion == null || ubicacion.isEmpty())) {
            resultado = medicoRepository.findByAceptadoTrue();
        } else if (especialidad == null || especialidad.isEmpty()) {
            resultado = medicoRepository.findByUbicacionIgnoreCaseAndAceptadoTrue(ubicacion);
        } else if (ubicacion == null || ubicacion.isEmpty()) {
            resultado = medicoRepository.findByEspecialidadIgnoreCaseAndAceptadoTrue(especialidad);
        } else {
            resultado = medicoRepository.findByEspecialidadAndUbicacionIgnoreCaseAndAceptadoTrue(especialidad, ubicacion);
        }
        return resultado;
    }

    public List<Medico> findByAceptadoTrue() {
        return medicoRepository.findByAceptadoTrue();
    }

    public List<Medico> findByAceptadoFalse() {
        return medicoRepository.findByAceptadoFalse();
    }

    public void deleteMedico(String idMedico) {
        medicoRepository.deleteById(idMedico);
        usuarioRepository.deleteById(idMedico);
    }

    public void acceptMedico(String idMedico) {
        Medico medico = medicoRepository.findById(idMedico).orElse(null);
        medico.setAceptado(true);
        medicoRepository.save(medico);
    }

    public boolean update(String idMedico, String nombre, MultipartFile photo,
                                 List<String> dias, LocalTime horaInicio, LocalTime horaFin,
                                 String especialidad, String ciudad, String hospital,
                                 BigDecimal costo, Integer frecuencia) {

        Medico medico = medicoRepository.findById(idMedico).orElse(null);

        if(dias == null || dias.isEmpty()) {
            return false;
        }

        try {
            if (photo != null) {
                String nuevaFoto = fotoService.guardarFoto(idMedico, photo);
            }
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        horariosMedicoService.eliminarPorMedico(medico.getId());

        medico.setNombre(nombre);
        medico.setEspecialidad(especialidad);
        medico.setUbicacion(ciudad);
        medico.setHospital(hospital);
        medico.setCostoConsulta(costo);
        medico.setFrecuenciaCita(frecuencia);

        for (String dia : dias) {
            HorariosMedico horario = new HorariosMedico();
            horario.setIdMedico(medico);
            horario.setFecha(horariosMedicoService.calcularSiguienteFecha(dia));
            horario.setHoraInicio(horaInicio);
            horario.setHoraFin(horaFin);
            horario.setDia(dia);
            horario.setFrecuencia(frecuencia);
            horariosMedicoService.agregar(horario);
        }
        medicoRepository.save(medico);

        return true;
    }
}


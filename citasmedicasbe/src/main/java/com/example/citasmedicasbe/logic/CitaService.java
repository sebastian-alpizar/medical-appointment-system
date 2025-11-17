package com.example.citasmedicasbe.logic;

import com.example.citasmedicasbe.data.CitaRepository;
import com.example.citasmedicasbe.data.MedicoRepository;
import com.example.citasmedicasbe.data.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.SessionAttributes;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@SessionAttributes({"medico"})
@org.springframework.stereotype.Service("citaService")
public class CitaService {
    @Autowired
    private CitaRepository citaRepository;

    @Autowired
    private MedicoRepository medicoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    public List<Cita> citaFindAll() {
        return citaRepository.findAll();
    }

    public boolean verificarCitaOcupada(Medico idMedico, LocalDate fecha, LocalTime hora) {
        return citaRepository.existsByIdMedicoAndFechaAndHora(idMedico, fecha, hora);
    }

    public List<Cita> findByStatusAndNombreMedico(String estado, String nombreMedico, String idPaciente) {
        List<Cita> citas;
        boolean nombreMedicoVacio = (nombreMedico == null || nombreMedico.isBlank());

        if ("ALL".equalsIgnoreCase(estado)) {
            if (nombreMedicoVacio) {
                citas = citaRepository.findByIdPaciente_IdOrderByFechaAscHoraAsc(idPaciente);
            } else {
                citas = citaRepository.findByIdPaciente_IdAndIdMedico_NombreIgnoreCaseOrderByFechaAscHoraAsc(
                        idPaciente, nombreMedico
                );
            }
        } else {
            boolean estadoBooleano = "ATTENDED".equalsIgnoreCase(estado);

            if (nombreMedicoVacio) {
                citas = citaRepository.findByEstadoAndIdPaciente_IdOrderByFechaAscHoraAsc(
                        estadoBooleano, idPaciente
                );
            } else {
                citas = citaRepository.findByEstadoAndIdMedico_NombreIgnoreCaseAndIdPaciente_IdOrderByFechaAscHoraAsc(
                        estadoBooleano, nombreMedico, idPaciente
                );
            }
        }
        return citas;
    }

    public List<Cita> findByStatusAndNombrePaciente(String estado, String nombrePaciente, String idMedico) {
        List<Cita> citas;
        boolean nombrePacienteVacio = (nombrePaciente == null || nombrePaciente.isBlank());

        if ("ALL".equalsIgnoreCase(estado)) {
            if (nombrePacienteVacio) {
                citas = citaRepository.findByIdMedico_IdOrderByFechaAscHoraAsc(idMedico);
            } else {
                citas = citaRepository.findByIdMedico_IdAndIdPaciente_NombreIgnoreCaseOrderByFechaAscHoraAsc(
                        idMedico, nombrePaciente
                );
            }
        } else {
            boolean estadoBooleano = "ATTENDED".equalsIgnoreCase(estado);

            if (nombrePacienteVacio) {
                citas = citaRepository.findByEstadoAndIdMedico_IdOrderByFechaAscHoraAsc(
                        estadoBooleano, idMedico
                );
            } else {
                citas = citaRepository.findByEstadoAndIdPaciente_NombreIgnoreCaseAndIdMedico_IdOrderByFechaAscHoraAsc(
                        estadoBooleano, nombrePaciente, idMedico
                );
            }
        }
        return citas;
    }

    public void deleteById(String citaId) {
        citaRepository.deleteById(citaId);
    }

    public Cita buscarCita(String citaId) {
        return citaRepository.findById(citaId).orElse(null);
    }

    public void accept(String citaId) {
        Cita cita = buscarCita(citaId);
        cita.setEstado(true);
        citaRepository.save(cita);
    }

    public boolean save(String idMedico, String fecha, String hora, String idPaciente) {
        Medico medico = medicoRepository.findById(idMedico).orElse(null);
        Paciente paciente = pacienteRepository.findById(idPaciente).orElse(null);

        Cita cita = new Cita();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        cita.setFecha(LocalDate.parse(fecha, dateFormatter));
        cita.setHora(LocalTime.parse(hora, timeFormatter));
        cita.setIdMedico(medico);
        cita.setIdPaciente(paciente);
        cita.setEstado(false);
        citaRepository.save(cita);
        return true;
    }

    public Cita addNote(String nota, String citaId) {
        Cita cita = citaRepository.findById(citaId).orElse(null);
        cita.setNota(nota);
        citaRepository.save(cita);
        return cita;
    }

    public List<Cita> findByIdPaciente(String idPaciente) {
        return citaRepository.findByIdPaciente_Id(idPaciente);
    }

    public List<Cita> findByIdMedico(String idMedico) {
        return citaRepository.findByIdMedico_Id(idMedico);
    }
}


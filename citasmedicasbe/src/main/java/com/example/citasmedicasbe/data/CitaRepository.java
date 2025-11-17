package com.example.citasmedicasbe.data;

import com.example.citasmedicasbe.logic.Cita;
import com.example.citasmedicasbe.logic.Medico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface CitaRepository extends JpaRepository<Cita, String> {
    boolean existsByIdMedicoAndFechaAndHora(Medico idMedico, LocalDate fecha, LocalTime hora);
    List<Cita> findByIdMedico_Id(String idMedico);
    List<Cita> findByIdPaciente_Id(String paciente);

    // Para buscar citas de pacientes por status y nombre de medico
    List<Cita> findByIdPaciente_IdOrderByFechaAscHoraAsc(String idPaciente);
    List<Cita> findByIdPaciente_IdAndIdMedico_NombreIgnoreCaseOrderByFechaAscHoraAsc(String idPaciente, String nombreMedico);
    List<Cita> findByEstadoAndIdPaciente_IdOrderByFechaAscHoraAsc(boolean estado, String idPaciente);
    List<Cita> findByEstadoAndIdMedico_NombreIgnoreCaseAndIdPaciente_IdOrderByFechaAscHoraAsc(boolean estado, String nombreMedico, String idPaciente);

    // Para buscar citas de medicos por status y nombre de paciente
    List<Cita> findByIdMedico_IdOrderByFechaAscHoraAsc(String idMedico);
    List<Cita> findByIdMedico_IdAndIdPaciente_NombreIgnoreCaseOrderByFechaAscHoraAsc(String idMedico, String nombrePaciente);
    List<Cita> findByEstadoAndIdMedico_IdOrderByFechaAscHoraAsc(boolean estadoBooleano, String idMedico);
    List<Cita> findByEstadoAndIdPaciente_NombreIgnoreCaseAndIdMedico_IdOrderByFechaAscHoraAsc(boolean estadoBooleano, String nombrePaciente, String idMedico);
}



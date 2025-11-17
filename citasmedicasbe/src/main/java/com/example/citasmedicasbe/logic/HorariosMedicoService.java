package com.example.citasmedicasbe.logic;

import com.example.citasmedicasbe.data.HorariosMedicoRepository;
import com.example.citasmedicasbe.data.MedicoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service("horariosMedicoService")
public class HorariosMedicoService {

    @Autowired
    private HorariosMedicoRepository horariosMedicoRepository;

    @Autowired
    private CitaService citaService;

    @Autowired
    private MedicoRepository medicoRepository;

    public List<Map<String, Object>> mapearHorarios(List<HorariosMedico> horarios) {
        List<Map<String, Object>> resultado = new ArrayList<>();

        for (HorariosMedico horario : horarios) {
            Map<String, Object> horarioMap = new HashMap<>();

            LocalDate siguienteFecha = calcularSiguienteFecha(horario.getDia());

            List<String> espacios = generarEspacios(horario.getHoraInicio(), horario.getHoraFin(), horario.getFrecuencia());

            // Verificar si los espacios están ocupados para el horario y la fecha ajustada
            List<Map<String, Object>> espaciosConEstado = verificarOcupacionDeEspacios(espacios, siguienteFecha, horario.getIdMedico());

            horarioMap.put("idMedico", horario.getIdMedico().getId());
            horarioMap.put("dia", horario.getDia());
            horarioMap.put("fecha", siguienteFecha.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            horarioMap.put("espacios", espaciosConEstado);

            resultado.add(horarioMap);
        }

        return resultado;
    }

    public LocalDate calcularSiguienteFecha(String dia) {
        DayOfWeek diaSemana = DayOfWeek.valueOf(dia.toUpperCase());
        LocalDate hoy = LocalDate.now();
        return hoy.with(TemporalAdjusters.nextOrSame(diaSemana));
    }

    private List<String> generarEspacios(LocalTime inicio, LocalTime fin, int frecuencia) {
        List<String> espacios = new ArrayList<>();
        LocalTime actual = inicio;
        while (!actual.isAfter(fin.minusMinutes(frecuencia))) {
            espacios.add(actual.format(DateTimeFormatter.ofPattern("HH:mm")));
            actual = actual.plusMinutes(frecuencia);
        }
        return espacios;
    }

    public List<Map<String, Object>> ajustarFechas(List<Map<String, Object>> horarios, int dias) {
        List<Map<String, Object>> horariosAjustados = new ArrayList<>();

        for (Map<String, Object> horarioMap : horarios) {
            // Obtener y ajustar la fecha
            String fechaStr = (String) horarioMap.get("fecha");
            LocalDate fecha = LocalDate.parse(fechaStr, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            fecha = fecha.plusDays(dias);

            // Obtener los espacios generados para la fecha ajustada
            @SuppressWarnings("unchecked")
            List<String> espacios = ((List<Map<String, Object>>) horarioMap.get("espacios"))
                    .stream()
                    .map(mapa -> (String) mapa.get("espacio")) // Extraer solo los valores de "espacio"
                    .collect(Collectors.toList());

            Object idMedicoObj = horarioMap.get("idMedico");

            String idMedico = (String) idMedicoObj;
            Medico medico = medicoRepository.findById(idMedico).orElse(null);
            List<Map<String, Object>> espaciosConEstado = verificarOcupacionDeEspacios(espacios, fecha, medico);

            horarioMap.put("fecha", fecha.format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            horarioMap.put("espacios", espaciosConEstado);

            horariosAjustados.add(horarioMap);
        }

        return horariosAjustados;
    }

    private List<Map<String, Object>> verificarOcupacionDeEspacios(List<String> espacios, LocalDate fecha, Medico medico) {
        List<Map<String, Object>> espaciosConEstado = new ArrayList<>();

        for (String espacio : espacios) {
            LocalTime horaCita = LocalTime.parse(espacio, DateTimeFormatter.ofPattern("HH:mm"));

            // Verificar si el espacio está ocupado
            boolean ocupado = citaService.verificarCitaOcupada(medico, fecha, horaCita);

            Map<String, Object> espacioMap = new HashMap<>();
            espacioMap.put("espacio", espacio);
            espacioMap.put("ocupado", ocupado);

            espaciosConEstado.add(espacioMap);
        }
        return espaciosConEstado;
    }

    public List<Map<String, Object>> restarSieteDias(List<Map<String, Object>> horarios) {
        return ajustarFechas(horarios, -7);
    }

    public List<Map<String, Object>> sumarSieteDias(List<Map<String, Object>> horarios) {
        return ajustarFechas(horarios, 7);
    }

    public List<HorariosMedico> obtenerTodosHorarios() {
        return (List<HorariosMedico>) horariosMedicoRepository.findAll();
    }

    public List<HorariosMedico> obtenerPorIds(List<String> idMedicos) {
        return horariosMedicoRepository.findByIdMedico_IdIn(idMedicos);
    }

    public void agregar(HorariosMedico horario) {
        horariosMedicoRepository.save(horario);
    }

    @Transactional
    public void eliminarPorMedico(String idMedico){
        horariosMedicoRepository.deleteByIdMedico_Id(idMedico);
    }
}

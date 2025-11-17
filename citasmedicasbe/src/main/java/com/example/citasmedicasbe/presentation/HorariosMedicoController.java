package com.example.citasmedicasbe.presentation;

import com.example.citasmedicasbe.logic.HorariosMedico;
import com.example.citasmedicasbe.logic.HorariosMedicoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/horarios")
public class HorariosMedicoController {

    @Autowired
    HorariosMedicoService horariosMedicoService;

    @GetMapping()
    public List<Map<String, Object>> list(@RequestParam List<String> idMedicos) {
        List<Map<String, Object>> horarios;
        List<HorariosMedico> horariosBD = horariosMedicoService.obtenerPorIds(idMedicos);
        horarios = horariosMedicoService.mapearHorarios(horariosBD);
        return horarios;
    }

    @PostMapping("/next")
    public List<Map<String, Object>> next(@RequestBody Map<String, Object> filtro) {
        List<Map<String, Object>> horarios = (List<Map<String, Object>>) filtro.get("horarios");
        return horariosMedicoService.sumarSieteDias(horarios);
    }

    @PostMapping("/prev")
    public List<Map<String, Object>> prev(@RequestBody Map<String, Object> filtro) {
        List<Map<String, Object>> horarios = (List<Map<String, Object>>) filtro.get("horarios");
        return horariosMedicoService.restarSieteDias(horarios);
    }

}


package com.example.citasmedicasbe.presentation;

import com.example.citasmedicasbe.logic.*;
import com.example.citasmedicasbe.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/medicos")
public class MedicoController {
    @Autowired
    MedicoService medicoService;

    @Autowired
    SecurityUtils securityUtils;

    @GetMapping()
    public List<Medico> findByAceptadoTrue() {
        return medicoService.findByAceptadoTrue();
    }

    @GetMapping("/espera")
    public List<Medico> findByAceptadoFalse() {
        return medicoService.findByAceptadoFalse();
    }

    @PostMapping("/delete")
    public void delete(@RequestParam String id) {
        medicoService.deleteMedico(id);
    }

    @PostMapping("/accept")
    public void accept(@RequestParam String id) {
        medicoService.acceptMedico(id);
    }

    @GetMapping("/search")
    List<Medico> search(@RequestParam(required = false) String especialidad,
                        @RequestParam(required = false) String ubicacion) {
        return medicoService.buscarPorEspecialidadYUbicacion(especialidad, ubicacion);
    }

    @PutMapping("/update")
    public boolean update(
            @RequestParam String nombre,
            @RequestParam(required = false) MultipartFile photo,
            @RequestParam(value = "dias", required = false) List<String> dias,
            @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime horaInicio,
            @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime horaFin,
            @RequestParam String especialidad,
            @RequestParam String ubicacion,
            @RequestParam String hospital,
            @RequestParam BigDecimal costo,
            @RequestParam Integer frecuencia) {

        String idMedico = securityUtils.getAuthenticatedUserId();
        return medicoService.update(idMedico, nombre, photo, dias, horaInicio, horaFin, especialidad, ubicacion, hospital, costo, frecuencia);
    }
}

package com.example.citasmedicasbe.presentation;

import com.example.citasmedicasbe.logic.Cita;
import com.example.citasmedicasbe.logic.CitaService;
import com.example.citasmedicasbe.security.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/citas")
public class CitaController {

    @Autowired
    CitaService citaService;

    @Autowired
    SecurityUtils securityUtils;

    @GetMapping
    public List<Cita> findAll() {
        return citaService.citaFindAll();
    }

    @GetMapping("/{id}")
    public List<Cita> findByIdMedico(@PathVariable String id) {
        return citaService.findByIdMedico(id);
    }

    @PostMapping("/save")
    public boolean save(@RequestParam String idMedico,
                        @RequestParam String fecha,
                        @RequestParam String hora) {

        String idPaciente = securityUtils.getAuthenticatedUserId();
        return citaService.save(idMedico, fecha, hora, idPaciente);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable String id) {
        citaService.deleteById(id);
    }

    @PutMapping("/accept/{id}")
    public void accept(@PathVariable String id) {
        citaService.accept(id);
    }

    @PutMapping("/addNota/{id}")
    public Cita addNote(@PathVariable String id, @RequestBody String nota) {
        return citaService.addNote(nota, id);
    }

    @GetMapping("/porPaciente/{id}")
    public List<Cita> findByIdPaciente(@PathVariable String id) {
        return citaService.findByIdPaciente(id);
    }

    @PostMapping("/statusAndMedico")
    public List<Cita> statusAndMedico(@RequestBody Map<String, String> filtro) {
        String status = filtro.get("status");
        String nombreMedico = filtro.get("medico");
        String idPaciente = securityUtils.getAuthenticatedUserId();
        return citaService.findByStatusAndNombreMedico(status, nombreMedico, idPaciente);
    }

    @PostMapping("/statusAndPaciente")
    public List<Cita> statusAndPaciente(@RequestBody Map<String, String> filtro) {
        String status = filtro.get("status");
        String nombrePaciente = filtro.get("paciente");
        String idMedico = securityUtils.getAuthenticatedUserId();
        return citaService.findByStatusAndNombrePaciente(status, nombrePaciente, idMedico);
    }
}

package com.example.citasmedicasbe.data;

import com.example.citasmedicasbe.logic.HorariosMedico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorariosMedicoRepository extends JpaRepository<HorariosMedico, String> {
    Iterable<HorariosMedico> findByIdMedico_Id(String idMedico);
    void deleteByIdMedico_Id(String idMedico);
    List<HorariosMedico> findByIdMedico_IdIn(List<String> idMedicos);
}


package com.greenbuddy.greenbuddy.repository;

import com.greenbuddy.greenbuddy.model.GrowthJournal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GrowthJournalRepository
        extends JpaRepository<GrowthJournal, Long> {

    List<GrowthJournal>
    findByPlantIdOrderByEntryDateDesc(
            Long plantId
    );
}
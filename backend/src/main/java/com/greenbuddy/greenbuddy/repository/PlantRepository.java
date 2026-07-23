package com.greenbuddy.greenbuddy.repository;

import com.greenbuddy.greenbuddy.model.Plant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlantRepository
        extends JpaRepository<Plant, Long> {

    long countByFavoriteTrue();
}
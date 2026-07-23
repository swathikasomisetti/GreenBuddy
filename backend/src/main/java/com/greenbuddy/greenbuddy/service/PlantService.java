package com.greenbuddy.greenbuddy.service;

import com.greenbuddy.greenbuddy.dto.plant.PlantRequest;
import com.greenbuddy.greenbuddy.model.Plant;
import com.greenbuddy.greenbuddy.repository.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.greenbuddy.greenbuddy.dto.plant.WateringReminderResponse;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.temporal.ChronoUnit;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlantService {

    private final PlantRepository plantRepository;

    // ── same pattern used for journal photos ──
    private static final String UPLOAD_DIR = "uploads/plants";

    public String storePlantImage(MultipartFile image) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalName = image.getOriginalFilename() != null
                ? image.getOriginalFilename()
                : "plant.jpg";

        String extension = originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".jpg";

        String filename = UUID.randomUUID() + extension;
        Path destination = uploadPath.resolve(filename);

        Files.copy(image.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        // Relative URL the frontend will store on the plant and resolve against BASE_URL
        return "/uploads/plants/" + filename;
    }

    public Plant createPlant(PlantRequest request) {

        Plant plant = Plant.builder()
                .plantName(request.getPlantName())
                
                .location(request.getLocation())
                .imageUrl(request.getImageUrl())
                .healthStatus(request.getHealthStatus())
                .wateringFrequency(request.getWateringFrequency())
                .fertilizerFrequency(request.getFertilizerFrequency())
                .scientificName(request.getScientificName())
.sunlight(request.getSunlight())

.temperature(request.getTemperature())
.humidity(request.getHumidity())
.soil(request.getSoil())
.petSafety(request.getPetSafety())
.indoorOutdoor(request.getIndoorOutdoor())
.commonProblems(request.getCommonProblems())
.careTips(request.getCareTips())
.description(request.getDescription())
.wikipediaLink(request.getWikipediaLink())
.lastWateredDate(request.getLastWateredDate())
.favorite(request.isFavorite())
.category(
    request.getCategory() != null
        ? request.getCategory()
        : "Outdoor"
)
                .build();

        return plantRepository.save(plant);
    } public Plant getPlantById(Long id) {
    return plantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Plant not found"));
}
public Plant updatePlant(Long id, PlantRequest request) {

    Plant plant = plantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Plant not found"));

    plant.setPlantName(request.getPlantName());
   
    plant.setLocation(request.getLocation());
    plant.setImageUrl(request.getImageUrl());
    plant.setHealthStatus(request.getHealthStatus());
    plant.setWateringFrequency(request.getWateringFrequency());
    plant.setFertilizerFrequency(request.getFertilizerFrequency());
    plant.setScientificName(request.getScientificName());
plant.setSunlight(request.getSunlight());
plant.setTemperature(request.getTemperature());

plant.setHumidity(request.getHumidity());

plant.setSoil(request.getSoil());

plant.setPetSafety(request.getPetSafety());

plant.setIndoorOutdoor(request.getIndoorOutdoor());

plant.setCommonProblems(request.getCommonProblems());

plant.setCareTips(request.getCareTips());

plant.setDescription(request.getDescription());

plant.setWikipediaLink(request.getWikipediaLink());
plant.setLastWateredDate(
    request.getLastWateredDate()

);
plant.setFavorite(request.isFavorite());
plant.setCategory(request.getCategory());


    return plantRepository.save(plant);
}

public void deletePlant(Long id) {

    Plant plant = plantRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Plant not found"));

    plantRepository.delete(plant);
} 



    public List<Plant> getAllPlants() {
        return plantRepository.findAll();
    }
    public Plant toggleFavorite(Long id) {

    Plant plant = plantRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Plant not found"));

    plant.setFavorite(!plant.isFavorite());

    return plantRepository.save(plant);
}
public LocalDate getNextWateringDate(Plant plant) {

    if (plant.getLastWateredDate() == null ||
        plant.getWateringFrequency() == null) {

        return null;
    }

    return plant.getLastWateredDate()
            .plusDays(
                    plant.getWateringFrequency()
            );
}
public List<WateringReminderResponse>
getOverduePlants() {

    LocalDate today = LocalDate.now();

    return plantRepository.findAll()
            .stream()
            .filter(p ->
                    p.getLastWateredDate() != null &&
                    p.getWateringFrequency() != null
            )
            .filter(p -> {

                LocalDate nextDate =
                        p.getLastWateredDate()
                                .plusDays(
                                        p.getWateringFrequency()
                                );

                return today.isEqual(nextDate) || today.isAfter(nextDate);
            })
            .map(p -> {

                LocalDate nextDate =
                        p.getLastWateredDate()
                                .plusDays(
                                        p.getWateringFrequency()
                                );

                long overdue =
                        ChronoUnit.DAYS.between(
                                nextDate,
                                today
                        );

                return new WateringReminderResponse(
                        p.getId(),
                        p.getPlantName(),
                        overdue
                );
            })
            .toList();
}
public Plant waterPlant(Long id) {

    Plant plant = plantRepository.findById(id)
            .orElseThrow(() ->
                    new RuntimeException("Plant not found"));

    plant.setLastWateredDate(
            java.time.LocalDate.now()
    );

    return plantRepository.save(plant);
}
public int calculateHealthScore(Plant plant) {

    int score = 100;

    if ("Needs Attention".equalsIgnoreCase(
            plant.getHealthStatus())) {
        score -= 25;
    }

    if ("Critical".equalsIgnoreCase(
            plant.getHealthStatus())) {
        score -= 50;
    }

    if (plant.getLastWateredDate() != null &&
        plant.getWateringFrequency() != null) {

        LocalDate nextWaterDate =
                plant.getLastWateredDate()
                        .plusDays(
                                plant.getWateringFrequency()
                        );

        if (LocalDate.now()
                .isAfter(nextWaterDate)) {

            score -= 20;
        }
    }

    return Math.max(score, 0);
}
}
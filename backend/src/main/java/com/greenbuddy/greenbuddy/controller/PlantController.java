package com.greenbuddy.greenbuddy.controller;

import com.greenbuddy.greenbuddy.dto.plant.PlantRequest;
import com.greenbuddy.greenbuddy.model.Plant;
import com.greenbuddy.greenbuddy.service.PlantService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.greenbuddy.greenbuddy.dto.plant.WateringReminderResponse;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/plants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlantController {

    private final PlantService plantService;

    @PostMapping
    public Plant createPlant(@RequestBody PlantRequest request) {
        return plantService.createPlant(request);
    }

    // NEW: upload a plant photo, get back a URL to attach to the plant.
    // Frontend calls this FIRST, then sends the returned imageUrl as part
    // of the normal JSON createPlant/updatePlant request.
    @PostMapping("/upload-image")
    public Map<String, String> uploadImage(
            @RequestParam("image") MultipartFile image
    ) throws IOException {
        String imageUrl = plantService.storePlantImage(image);
        return Map.of("imageUrl", imageUrl);
    }

    @GetMapping
    public List<Plant> getAllPlants() {
        return plantService.getAllPlants();
    }

    @GetMapping("/{id}")
    public Plant getPlantById(@PathVariable Long id) {
        return plantService.getPlantById(id);
    }
    
    @GetMapping("/overdue")
public List<WateringReminderResponse>
getOverduePlants() {

    return plantService.getOverduePlants();
}
    @PutMapping("/{id}")
    public Plant updatePlant(
            @PathVariable Long id,
            @RequestBody PlantRequest request
    ) {
        return plantService.updatePlant(id, request);
    }

    @PatchMapping("/{id}/favorite")
public Plant toggleFavorite(
        @PathVariable Long id
) {
    return plantService.toggleFavorite(id);
}
@PatchMapping("/{id}/water")
public Plant waterPlant(
        @PathVariable Long id
) {
    return plantService.waterPlant(id);
}
   

    @DeleteMapping("/{id}")
    public String deletePlant(@PathVariable Long id) {
        plantService.deletePlant(id);
        return "Plant deleted successfully";
    }
}
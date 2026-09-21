package com.greenbuddy.greenbuddy.controller;

import com.greenbuddy.greenbuddy.dto.ai.*;
import com.greenbuddy.greenbuddy.model.Plant;
import com.greenbuddy.greenbuddy.repository.PlantRepository;
import com.greenbuddy.greenbuddy.service.ai.GeminiService;
import com.greenbuddy.greenbuddy.service.ai.PlantHealthPredictorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIController {

    private final GeminiService geminiService;
    private final PlantHealthPredictorService healthPredictorService;
    private final PlantRepository plantRepository;

    @PostMapping("/chat")
    public ChatResponse chat(@RequestBody ChatRequest request) {
        String reply = geminiService.askGemini(request.getMessage());
        return new ChatResponse(reply);
    }

    @PostMapping("/generate-plant")
    public PlantCareResponse generatePlant(@RequestBody GeneratePlantRequest request) {
        return geminiService.generatePlantDetails(request.getPlantName());
    }

    @PostMapping("/my-plants-chat")
    public ChatResponse myPlantsChat(@RequestBody ChatRequest request) {
        String reply = geminiService.chatWithMyPlants(request.getMessage());
        return new ChatResponse(reply);
    }

    @PostMapping("/diagnose")
    public ResponseEntity<AIDiagnosisResponse> diagnosePlant(@RequestBody AIDiagnosisRequest request) {
        AIDiagnosisResponse diagnosis = geminiService.diagnosePlantIssue(request);
        return ResponseEntity.ok(diagnosis);
    }

    @PostMapping("/identify")
    public ResponseEntity<PlantIdentificationResponse> identifyPlant(@RequestBody Map<String, String> body) {
        String query = body.getOrDefault("query", body.getOrDefault("plantName", ""));
        String imageBase64 = body.getOrDefault("imageBase64", "");
        PlantIdentificationResponse response = geminiService.identifyPlant(query, imageBase64);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/predict/{plantId}")
    public ResponseEntity<HealthPredictionResponse> predictPlantHealth(@PathVariable Long plantId) {
        return plantRepository.findById(plantId)
                .map(plant -> ResponseEntity.ok(healthPredictorService.predictForPlant(plant)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/predict-custom")
    public ResponseEntity<HealthPredictionResponse> predictCustomHealth(@RequestBody PredictHealthRequest request) {
        HealthPredictionResponse response = healthPredictorService.predictCustom(request);
        return ResponseEntity.ok(response);
    }
}
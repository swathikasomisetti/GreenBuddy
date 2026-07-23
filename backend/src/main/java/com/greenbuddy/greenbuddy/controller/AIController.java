package com.greenbuddy.greenbuddy.controller;

import com.greenbuddy.greenbuddy.dto.ai.ChatRequest;
import com.greenbuddy.greenbuddy.dto.ai.ChatResponse;
import com.greenbuddy.greenbuddy.service.ai.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import com.greenbuddy.greenbuddy.dto.ai.GeneratePlantRequest;
import com.greenbuddy.greenbuddy.dto.ai.PlantCareResponse;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AIController {

    private final GeminiService geminiService;

    @PostMapping("/chat")
  
    public ChatResponse chat(@RequestBody ChatRequest request) {

        String reply = geminiService.askGemini(request.getMessage());

        return new ChatResponse(reply);
    }
    @PostMapping("/generate-plant")
public PlantCareResponse generatePlant(
        @RequestBody GeneratePlantRequest request) {

    return geminiService.generatePlantDetails(
            request.getPlantName());

} @PostMapping("/my-plants-chat")
public ChatResponse myPlantsChat(
        @RequestBody ChatRequest request) {

    String reply =
            geminiService.chatWithMyPlants(
                    request.getMessage()
            );

    return new ChatResponse(reply);

}

}
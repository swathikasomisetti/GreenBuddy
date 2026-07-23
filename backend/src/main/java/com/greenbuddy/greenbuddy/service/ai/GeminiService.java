package com.greenbuddy.greenbuddy.service.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.greenbuddy.greenbuddy.dto.ai.PlantCareResponse;
import com.greenbuddy.greenbuddy.model.Plant;
import com.greenbuddy.greenbuddy.repository.PlantRepository;
import java.util.List;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.builder().build();
private final PlantRepository plantRepository;
    public String askGemini(String question) {

        String prompt = """
                You are GreenBuddy AI.

                You are a professional botanist.

                Give short, accurate, beginner-friendly answers.

                If the user asks about plant care, always include:

                Scientific Name
                Watering Frequency
                Sunlight
                Temperature
                Humidity
                Soil
                Fertilizer
                Indoor/Outdoor
                Pet Safety
                Common Problems
                Care Tips

                User Question:
                """ + question;

        Map<String, Object> body = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text", prompt)
                                }
                        )
                }
        ); 

     String url =
"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
+ apiKey;

        try {

            Map response = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            var candidates = (java.util.List<?>) response.get("candidates");

            if (candidates == null || candidates.isEmpty()) {
                return "No response from AI.";
            }

            Map candidate = (Map) candidates.get(0);

            Map content = (Map) candidate.get("content");

            var parts = (java.util.List<?>) content.get("parts");

            Map part = (Map) parts.get(0);

            return part.get("text").toString();

        } catch (Exception e) {
    e.printStackTrace();
    return "ERROR: " + e.getMessage();
}

    }
public PlantCareResponse generatePlantDetails(String plantName) {

    String prompt = """
You are GreenBuddy AI.

Return ONLY valid JSON.

Do NOT explain anything.

Do NOT use markdown.

Do NOT use ```json.

Return exactly this structure:

{
  "plantName":"",
  "scientificName":"",
  "category":"",
  "wateringFrequency":0,
  "fertilizerFrequency":0,
  "sunlight":"",
  "temperature":"",
  "humidity":"",
  "soil":"",
  "description":"",
  "wikipediaLink":"",
  "petSafety":"",
  "indoorOutdoor":"",
  "commonProblems":"",
  "careTips":""
}

Plant:
""" + plantName;

String response = askGemini(prompt);

if (response.startsWith("ERROR:")) {
    throw new RuntimeException(response);
}

try {

    response = JsonExtractor.extract(response);

    ObjectMapper mapper = new ObjectMapper();

    PlantCareResponse plant = mapper.readValue(
            response,
            PlantCareResponse.class
    );

    // Normalize category values
    if ("Houseplant".equalsIgnoreCase(plant.getCategory())) {
        plant.setCategory("Indoor");
    }

    return plant;

} catch (Exception e) {

    e.printStackTrace();

    throw new RuntimeException("Failed to parse AI response.\n\nResponse:\n" + response);

}

}public String chatWithMyPlants(String question) {

    List<Plant> plants = plantRepository.findAll();

    StringBuilder plantData = new StringBuilder();

    for (Plant p : plants) {

        plantData.append("""
Plant Name: %s
Scientific Name: %s
Location: %s
Health: %s
Water Every: %s days
Last Watered: %s
Sunlight: %s
Temperature: %s
Humidity: %s
Soil: %s
Category: %s

"""
.formatted(
                p.getPlantName(),
                p.getScientificName(),
                p.getLocation(),
                p.getHealthStatus(),
                p.getWateringFrequency(),
                p.getLastWateredDate(),
                p.getSunlight(),
                p.getTemperature(),
                p.getHumidity(),
                p.getSoil(),
                p.getCategory()
        ));

    }

    String prompt = """
You are GreenBuddy AI.

The user is asking about THEIR OWN plants.

Answer using the plant collection below.

If the answer depends on the user's plants, use that information.

Plant Collection:

%s

User Question:

%s
""".formatted(plantData, question);

    return askGemini(prompt);

}
}
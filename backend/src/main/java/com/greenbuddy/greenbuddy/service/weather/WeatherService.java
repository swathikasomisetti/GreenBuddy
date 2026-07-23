package com.greenbuddy.greenbuddy.service.weather;

import com.greenbuddy.greenbuddy.dto.weather.WeatherResponse;
import com.greenbuddy.greenbuddy.dto.weather.PlantWeatherAdvice;
import com.greenbuddy.greenbuddy.exception.CityNotFoundException;
import com.greenbuddy.greenbuddy.model.Plant;
import com.greenbuddy.greenbuddy.repository.PlantRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    @Value("${weather.base.url}")
    private String baseUrl;

    private final WebClient webClient = WebClient.builder().build();
    private final PlantRepository plantRepository;

    public WeatherResponse getWeather(String city) {

        String url = baseUrl
                + "?q=" + city + ",IN"
                + "&appid=" + apiKey
                + "&units=metric";

        String response;
        try {
            response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        } catch (WebClientResponseException.NotFound ex) {
            throw new CityNotFoundException("City not found: " + city);
        } catch (WebClientResponseException ex) {
            throw new CityNotFoundException("Weather lookup failed for: " + city);
        }

        ObjectMapper mapper = new ObjectMapper();
        JsonNode root;
        try {
            root = mapper.readTree(response);
        } catch (Exception e) {
            throw new CityNotFoundException("Invalid weather response for: " + city);
        }

        if (root.has("cod") && !root.path("cod").asText().equals("200")) {
            throw new CityNotFoundException("City not found: " + city);
        }

        JsonNode weatherArray = root.path("weather");
        if (!weatherArray.isArray() || weatherArray.isEmpty()) {
            throw new CityNotFoundException("No weather data for: " + city);
        }

        double temp = root.path("main").path("temp").asDouble();
        int humidity = root.path("main").path("humidity").asInt();
        double wind = root.path("wind").path("speed").asDouble();
        String condition = weatherArray.get(0).path("main").asText();
        String icon = weatherArray.get(0).path("icon").asText();

        String advice = generateAdvice(temp, humidity, wind, condition);
        List<PlantWeatherAdvice> plantAdvice = generatePlantAdvice(temp, humidity, wind, condition);

        return new WeatherResponse(city, temp, humidity, wind, condition, icon, advice, plantAdvice);
    }

    private String generateAdvice(double temp, int humidity, double wind, String condition) {

        StringBuilder advice = new StringBuilder();

        if (condition.equalsIgnoreCase("Rain")) {
            advice.append("🌧 Rain expected. Avoid watering outdoor plants.\n");
        }

        if (temp > 35) {
            advice.append("☀ Very hot today. Water plants early morning or evening.\n");
        }

        if (humidity < 40) {
            advice.append("💧 Low humidity. Mist tropical plants.\n");
        }

        if (wind > 8) {
            advice.append("🍃 Strong wind. Protect lightweight potted plants.\n");
        }

        if (advice.isEmpty()) {
            advice.append("🌿 Weather looks ideal for most plants today.");
        }

        return advice.toString();
    }

    private List<PlantWeatherAdvice> generatePlantAdvice(double temp, int humidity, double wind, String condition) {

        List<PlantWeatherAdvice> list = new ArrayList<>();
        List<Plant> plants = plantRepository.findAll();

        for (Plant plant : plants) {

            String advice;
            String status;

            if (condition.equalsIgnoreCase("Rain") && "Outdoor".equalsIgnoreCase(plant.getCategory())) {
                advice = "Rain expected. Skip watering today.";
                status = "RAIN";
            } else if (temp > 35 && plant.getWateringFrequency() != null && plant.getWateringFrequency() <= 3) {
                advice = "Hot weather. Water this evening.";
                status = "HOT";
            } else if (humidity < 40) {
                advice = "Low humidity. Mist the leaves.";
                status = "DRY";
            } else if (wind > 8 && "Outdoor".equalsIgnoreCase(plant.getCategory())) {
                advice = "Strong wind. Protect from damage.";
                status = "WIND";
            } else {
                advice = "Perfect weather today.";
                status = "GOOD";
            }

            list.add(new PlantWeatherAdvice(
                    plant.getId(),
                    plant.getPlantName(),
                    plant.getScientificName(),
                    advice,
                    status
            ));
        }

        return list;
    }
}
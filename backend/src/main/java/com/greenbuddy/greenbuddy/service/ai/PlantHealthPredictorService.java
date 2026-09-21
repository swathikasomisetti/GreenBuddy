package com.greenbuddy.greenbuddy.service.ai;

import com.greenbuddy.greenbuddy.dto.ai.HealthPredictionResponse;
import com.greenbuddy.greenbuddy.dto.ai.PredictHealthRequest;
import com.greenbuddy.greenbuddy.model.Plant;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class PlantHealthPredictorService {

    public HealthPredictionResponse predictForPlant(Plant plant) {
        int wateringFreq = (plant.getWateringFrequency() != null && plant.getWateringFrequency() > 0)
                ? plant.getWateringFrequency()
                : 7;

        int daysSinceWatered = 0;
        if (plant.getLastWateredDate() != null) {
            daysSinceWatered = (int) ChronoUnit.DAYS.between(plant.getLastWateredDate(), LocalDate.now());
            if (daysSinceWatered < 0) daysSinceWatered = 0;
        } else {
            // If never watered recorded, assume slightly overdue
            daysSinceWatered = wateringFreq + 1;
        }

        return computePrediction(
                plant.getId(),
                plant.getPlantName(),
                plant.getCategory(),
                wateringFreq,
                daysSinceWatered,
                plant.getSunlight(),
                plant.getHealthStatus()
        );
    }

    public HealthPredictionResponse predictCustom(PredictHealthRequest req) {
        int wateringFreq = (req.getWateringFrequency() != null && req.getWateringFrequency() > 0)
                ? req.getWateringFrequency()
                : 7;
        int daysSinceWatered = req.getDaysSinceWatered() != null ? req.getDaysSinceWatered() : 3;

        return computePrediction(
                null,
                req.getPlantName() != null ? req.getPlantName() : "Garden Plant",
                req.getCategory(),
                wateringFreq,
                daysSinceWatered,
                req.getSunlight(),
                req.getHealthStatus()
        );
    }

    private HealthPredictionResponse computePrediction(
            Long plantId,
            String plantName,
            String category,
            int wateringFreq,
            int daysSinceWatered,
            String sunlight,
            String healthStatus
    ) {
        boolean isSucculent = category != null && category.equalsIgnoreCase("Succulent");
        double ratio = (double) daysSinceWatered / (double) wateringFreq;

        int healthScore = 95;
        int dehydrationRisk = 10;
        int overwaterRisk = 15;
        String vitalityLevel = "Optimal";
        String wateringUrgency = "Normal";
        String badgeColor = "green";
        int daysUntilNextWater = Math.max(0, wateringFreq - daysSinceWatered);

        if (isSucculent) {
            // Succulents store water and suffer from overwatering much more than drought
            if (daysSinceWatered <= 2) {
                overwaterRisk = 65;
                wateringUrgency = "Low";
                healthScore = 90;
            } else if (ratio <= 1.0) {
                healthScore = 96;
                dehydrationRisk = 15;
                wateringUrgency = "Low";
            } else if (ratio <= 1.5) {
                healthScore = 88;
                dehydrationRisk = 35;
                wateringUrgency = "Normal";
            } else if (ratio <= 2.2) {
                healthScore = 78;
                dehydrationRisk = 60;
                wateringUrgency = "High";
                vitalityLevel = "Needs Attention";
                badgeColor = "amber";
            } else {
                healthScore = Math.max(30, (int) (70 - (ratio - 2.2) * 15));
                dehydrationRisk = 88;
                wateringUrgency = "Urgent";
                vitalityLevel = "Critical";
                badgeColor = "red";
            }
        } else {
            // Standard tropical & indoor / outdoor plants
            if (ratio < 0.2) {
                // Just watered today or yesterday
                healthScore = 98;
                dehydrationRisk = 5;
                wateringUrgency = "Low";
                vitalityLevel = "Optimal";
                badgeColor = "green";
            } else if (ratio <= 0.7) {
                healthScore = 94;
                dehydrationRisk = 20;
                wateringUrgency = "Normal";
                vitalityLevel = "Optimal";
                badgeColor = "green";
            } else if (ratio <= 1.0) {
                healthScore = 88;
                dehydrationRisk = 40;
                wateringUrgency = "Normal";
                vitalityLevel = "Good";
                badgeColor = "green";
            } else if (ratio <= 1.4) {
                healthScore = 74;
                dehydrationRisk = 65;
                wateringUrgency = "High";
                vitalityLevel = "Needs Attention";
                badgeColor = "amber";
            } else if (ratio <= 2.0) {
                healthScore = 58;
                dehydrationRisk = 82;
                wateringUrgency = "Urgent";
                vitalityLevel = "Needs Attention";
                badgeColor = "red";
            } else {
                healthScore = Math.max(25, (int) (50 - (ratio - 2.0) * 12));
                dehydrationRisk = 95;
                wateringUrgency = "Urgent";
                vitalityLevel = "Critical";
                badgeColor = "red";
            }
        }

        // Adjust for current recorded health status
        if (healthStatus != null) {
            String lower = healthStatus.toLowerCase();
            if (lower.contains("attention") || lower.contains("water")) {
                healthScore = Math.max(35, healthScore - 12);
            } else if (lower.contains("sick") || lower.contains("poor")) {
                healthScore = Math.max(20, healthScore - 25);
                vitalityLevel = "Critical";
                badgeColor = "red";
            }
        }

        List<String> checklist = new ArrayList<>();
        String recommendedAction;
        String aiRecommendation;

        if (wateringUrgency.equals("Urgent")) {
            recommendedAction = "Hydrate immediately with room-temperature filtered water.";
            checklist.add("Deep soak soil until water drains out of base holes");
            checklist.add("Mist leaves gently if tropical species");
            checklist.add("Keep out of harsh direct midday sun while recovering");
            aiRecommendation = plantName + " is showing severe moisture deficit (score: " + healthScore + "/100). Rehydrate promptly and inspect for brittle leaf tips.";
        } else if (wateringUrgency.equals("High")) {
            recommendedAction = "Check top 2 inches of soil; water today if dry.";
            checklist.add("Perform finger test 2 inches into soil");
            checklist.add("Water evenly around the root zone");
            checklist.add("Empty drainage tray after 15 minutes");
            aiRecommendation = plantName + " is approaching its watering threshold. Soil moisture is depleted.";
        } else if (wateringUrgency.equals("Low")) {
            recommendedAction = "Soil moisture is sufficient. No watering needed today.";
            checklist.add("Allow soil to aerate naturally");
            checklist.add("Rotate pot 90 degrees for even sunlight exposure");
            checklist.add("Inspect leaves for dust and wipe gently");
            aiRecommendation = plantName + " is flourishing with balanced hydration. Next scheduled hydration in approximately " + daysUntilNextWater + " days.";
        } else {
            recommendedAction = "Maintain standard care schedule. Next water in " + daysUntilNextWater + " days.";
            checklist.add("Check soil dryness every 2 days");
            checklist.add("Ensure adequate ambient indirect light");
            checklist.add("Check under leaves for early pest signs");
            aiRecommendation = plantName + " is in a stable health zone (vitality: " + vitalityLevel + "). Continue regular watering intervals.";
        }

        return HealthPredictionResponse.builder()
                .plantId(plantId)
                .plantName(plantName)
                .healthScore(healthScore)
                .vitalityLevel(vitalityLevel)
                .wateringUrgency(wateringUrgency)
                .daysSinceWatered(daysSinceWatered)
                .daysUntilNextWater(daysUntilNextWater)
                .dehydrationRiskPercent(dehydrationRisk)
                .overwateringRiskPercent(overwaterRisk)
                .statusBadgeColor(badgeColor)
                .recommendedAction(recommendedAction)
                .actionChecklist(checklist)
                .aiRecommendation(aiRecommendation)
                .build();
    }
}

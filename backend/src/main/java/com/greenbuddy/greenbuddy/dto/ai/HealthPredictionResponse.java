package com.greenbuddy.greenbuddy.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthPredictionResponse {

    private Long plantId;

    private String plantName;

    private Integer healthScore; // 0 - 100

    private String vitalityLevel; // Optimal, Good, Needs Attention, Critical

    private String wateringUrgency; // Low, Normal, High, Urgent, Overwater Risk

    private Integer daysSinceWatered;

    private Integer daysUntilNextWater;

    private Integer dehydrationRiskPercent;

    private Integer overwateringRiskPercent;

    private String statusBadgeColor; // green, emerald, amber, red

    private String recommendedAction;

    private List<String> actionChecklist;

    private String aiRecommendation;
}

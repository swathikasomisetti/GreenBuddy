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
public class AIDiagnosisResponse {

    private String diseaseName;

    private String scientificClassification;

    private Integer confidenceScore; // e.g. 92%

    private String severity; // Mild, Moderate, Severe

    private String primaryCause;

    private List<String> identifiedSymptoms;

    private List<String> treatmentSteps;

    private List<String> organicRemedies;

    private List<String> preventionTips;

    private String wateringAdjustment;

    private String sunlightAdjustment;

    private String summary;
}

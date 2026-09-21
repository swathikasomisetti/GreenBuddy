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
public class PlantIdentificationResponse {

    private String plantName;

    private String scientificName;

    private Integer confidenceScore; // e.g. 95%

    private String category;

    private Integer wateringFrequency;

    private Integer fertilizerFrequency;

    private String sunlight;

    private String temperature;

    private String humidity;

    private String soil;

    private String petSafety;

    private String indoorOutdoor;

    private String description;

    private String careTips;

    private List<String> alternativeMatches;
}

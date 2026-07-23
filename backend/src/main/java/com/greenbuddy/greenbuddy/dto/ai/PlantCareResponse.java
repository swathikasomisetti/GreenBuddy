package com.greenbuddy.greenbuddy.dto.ai;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlantCareResponse {

    private String plantName;

    private String scientificName;

    private String category;

    private Integer wateringFrequency;

    private Integer fertilizerFrequency;

    private String sunlight;

    private String temperature;

    private String humidity;

    private String soil;

    private String description;

    private String wikipediaLink;

    private String petSafety;

    private String indoorOutdoor;

    private String commonProblems;

    private String careTips;
}
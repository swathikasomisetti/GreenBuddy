package com.greenbuddy.greenbuddy.dto.plant;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PlantRequest {

    private String plantName;
   
    private String location;
    private String imageUrl;
    private String healthStatus;

    private String category;
    private boolean favorite;

    private Integer wateringFrequency;
    private Integer fertilizerFrequency;

    private String scientificName;

    private String sunlight;

    private String temperature;

    private String humidity;

    private String soil;

    private String indoorOutdoor;

    private String petSafety;

    private String commonProblems;

    private String careTips;

    private LocalDate lastWateredDate;

    private String description;

    private String wikipediaLink;

}
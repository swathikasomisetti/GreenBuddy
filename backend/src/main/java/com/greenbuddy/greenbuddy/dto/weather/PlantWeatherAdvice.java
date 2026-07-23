package com.greenbuddy.greenbuddy.dto.weather;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlantWeatherAdvice {

    private Long plantId;

    private String plantName;

    private String scientificName;

    private String advice;

    private String status;
}
package com.greenbuddy.greenbuddy.dto.weather;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeatherResponse {

    private String city;

    private double temperature;

    private int humidity;

    private double windSpeed;

    private String condition;

    private String icon;

    private String advice;

    private List<PlantWeatherAdvice> plantAdvice;

}
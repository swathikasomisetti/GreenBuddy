package com.greenbuddy.greenbuddy.controller;

import com.greenbuddy.greenbuddy.dto.weather.WeatherResponse;
import com.greenbuddy.greenbuddy.exception.CityNotFoundException;
import com.greenbuddy.greenbuddy.service.weather.WeatherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/weather")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WeatherController {

    private final WeatherService weatherService;

    @GetMapping("/{city}")
    public ResponseEntity<?> getWeather(@PathVariable String city) {
        try {
            WeatherResponse res = weatherService.getWeather(city);
            return ResponseEntity.ok(res);
        } catch (CityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }catch (Exception ex) {
    ex.printStackTrace();   // <-- Print the real exception
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ex.getMessage());
}
    }
}
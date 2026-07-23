package com.greenbuddy.greenbuddy.service;

import com.greenbuddy.greenbuddy.dto.calendar.CalendarEventDTO;
import com.greenbuddy.greenbuddy.model.Plant;
import com.greenbuddy.greenbuddy.repository.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final PlantRepository plantRepository;

    public List<CalendarEventDTO> getCalendarEvents() {

        LocalDate today = LocalDate.now();

        List<CalendarEventDTO> events = new ArrayList<>();

        List<Plant> plants = plantRepository.findAll();

        for (Plant plant : plants) {

            if (plant.getLastWateredDate() == null)
                continue;

            if (plant.getWateringFrequency() == null)
                continue;

            LocalDate nextWaterDate =
                    plant.getLastWateredDate()
                            .plusDays(plant.getWateringFrequency());

            String color;
            String status;

            if (nextWaterDate.isBefore(today)) {

                color = "#e74c3c";
                status = "OVERDUE";

            } else if (nextWaterDate.isEqual(today)) {

                color = "#f39c12";
                status = "TODAY";

            } else {

                color = "#27ae60";
                status = "UPCOMING";
            }

            events.add(

                    new CalendarEventDTO(

                            plant.getId(),

                            plant.getPlantName(),

                            nextWaterDate.toString(),

                            color,

                            status,

                            "Watering"
                    )

            );
        }

        return events;
    }

}
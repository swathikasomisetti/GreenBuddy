package com.greenbuddy.greenbuddy.controller;

import com.greenbuddy.greenbuddy.dto.calendar.CalendarEventDTO;
import com.greenbuddy.greenbuddy.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
@CrossOrigin(origins="*")
public class CalendarController {

    private final CalendarService calendarService;

    @GetMapping("/events")
    public List<CalendarEventDTO> getEvents(){

        return calendarService.getCalendarEvents();

    }

}
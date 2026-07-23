package com.greenbuddy.greenbuddy.dto.calendar;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CalendarEventDTO {

    private Long plantId;

    private String title;

    private String start;

    private String color;

    private String status;

    private String eventType;
}
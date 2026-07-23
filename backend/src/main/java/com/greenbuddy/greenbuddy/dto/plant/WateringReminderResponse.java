package com.greenbuddy.greenbuddy.dto.plant;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WateringReminderResponse {

    private Long plantId;
    private String plantName;
    private long overdueDays;
}
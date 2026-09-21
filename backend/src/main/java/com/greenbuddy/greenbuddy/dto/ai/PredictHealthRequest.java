package com.greenbuddy.greenbuddy.dto.ai;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PredictHealthRequest {

    private String plantName;

    private String category; // Indoor, Outdoor, Succulent

    private Integer wateringFrequency; // e.g. 7 days

    private Integer daysSinceWatered; // e.g. 10 days

    private String sunlight;

    private String healthStatus; // Healthy, Needs Attention, Sick
}

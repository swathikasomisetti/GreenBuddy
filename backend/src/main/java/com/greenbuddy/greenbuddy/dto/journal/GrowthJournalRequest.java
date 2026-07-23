package com.greenbuddy.greenbuddy.dto.journal;

import lombok.Data;

@Data
public class GrowthJournalRequest {

    private Long plantId;

    private String note;
}
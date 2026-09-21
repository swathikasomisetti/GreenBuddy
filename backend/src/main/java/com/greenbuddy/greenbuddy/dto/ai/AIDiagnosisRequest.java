package com.greenbuddy.greenbuddy.dto.ai;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class AIDiagnosisRequest {

    private String plantName;

    private List<String> symptoms;

    private String notes;

    private String imageBase64;
}

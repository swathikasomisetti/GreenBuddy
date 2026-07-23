package com.greenbuddy.greenbuddy.dto.profile;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String avatarUrl;
    private String bio;
    private String city;
    private String experienceLevel;
}
package com.greenbuddy.greenbuddy.dto.profile;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    private String bio;
    private String city;
    private String experienceLevel;
    private String currentPassword;
    private String newPassword;
}
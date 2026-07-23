package com.greenbuddy.greenbuddy.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "plants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Plant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String plantName;

    

    private String location;

    private String imageUrl;

    private String healthStatus;

    @Column(nullable = false)
    private String category;

    private boolean favorite;

    private Integer wateringFrequency;

    private Integer fertilizerFrequency;

    private String scientificName;

    private String sunlight;

    private String temperature;

    // ===== AI GENERATED DETAILS =====

    private String humidity;

    private String soil;

    private String petSafety;

    private String indoorOutdoor;

    @Column(length = 2000)
    private String commonProblems;

    @Column(length = 3000)
    private String careTips;

    // ================================

    private LocalDate lastWateredDate;

    @Column(length = 4000)
    private String description;

    private String wikipediaLink;
}
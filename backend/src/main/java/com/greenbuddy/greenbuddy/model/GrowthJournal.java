package com.greenbuddy.greenbuddy.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GrowthJournal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long plantId;

    @Column(length = 1000)
    private String note;

    private LocalDate entryDate;

    // NEW: relative URL to the stored photo, e.g. "/uploads/journal/abc123.jpg"
    // Null/empty when no photo was attached to this entry.
    private String photoUrl;
}
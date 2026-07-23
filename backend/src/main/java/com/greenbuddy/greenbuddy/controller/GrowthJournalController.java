package com.greenbuddy.greenbuddy.controller;

import com.greenbuddy.greenbuddy.dto.journal.GrowthJournalRequest;
import com.greenbuddy.greenbuddy.model.GrowthJournal;
import com.greenbuddy.greenbuddy.service.GrowthJournalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/journal")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class GrowthJournalController {

    

    private final GrowthJournalService service;

    // Kept for backwards compatibility — text-only entries.
    @PostMapping
    public GrowthJournal addEntry(
            @RequestBody
            GrowthJournalRequest request
    ) {
        return service.addEntry(request);
    }

    // NEW: entry with an optional photo attached (multipart/form-data).
    // "photo" is optional — if the user only writes a note, just omit it.
    @PostMapping("/upload")
    public GrowthJournal addEntryWithPhoto(
            @RequestParam("plantId") Long plantId,
            @RequestParam("note") String note,
            @RequestParam(value = "photo", required = false) MultipartFile photo
    ) throws IOException {
        return service.addEntryWithPhoto(plantId, note, photo);
    }

    @GetMapping("/{plantId}")
    public List<GrowthJournal> getEntries(
            @PathVariable Long plantId
    ) {
        return service.getEntries(
                plantId
        );
    }

    @DeleteMapping("/{entryId}")
    public void deleteEntry(@PathVariable Long entryId) {
        service.deleteEntry(entryId);
    }
}
package com.greenbuddy.greenbuddy.service;

import com.greenbuddy.greenbuddy.dto.journal.GrowthJournalRequest;
import com.greenbuddy.greenbuddy.model.GrowthJournal;
import com.greenbuddy.greenbuddy.repository.GrowthJournalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GrowthJournalService {

    private final GrowthJournalRepository repository;

    // Folder on disk where journal photos are stored.
    // Served back to the browser via the static mapping in WebConfig
    // (so a saved file at uploads/journal/xyz.jpg becomes /uploads/journal/xyz.jpg)
    private static final String UPLOAD_DIR = "uploads/journal";

    public GrowthJournal addEntry(
            GrowthJournalRequest request
    ) {

        GrowthJournal entry =
                GrowthJournal.builder()
                        .plantId(
                                request.getPlantId()
                        )
                        .note(
                                request.getNote()
                        )
                        .entryDate(
                                LocalDate.now()
                        )
                        .build();

        return repository.save(entry);
    }

    public GrowthJournal addEntryWithPhoto(
            Long plantId,
            String note,
            MultipartFile photo
    ) throws IOException {

        String photoUrl = null;

        if (photo != null && !photo.isEmpty()) {
            photoUrl = storePhoto(photo);
        }

        GrowthJournal entry = GrowthJournal.builder()
                .plantId(plantId)
                .note(note)
                .entryDate(LocalDate.now())
                .photoUrl(photoUrl)
                .build();

        return repository.save(entry);
    }

    private String storePhoto(MultipartFile photo) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalName = photo.getOriginalFilename() != null
                ? photo.getOriginalFilename()
                : "photo.jpg";

        String extension = originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf("."))
                : ".jpg";

        String filename = UUID.randomUUID() + extension;
        Path destination = uploadPath.resolve(filename);

        Files.copy(photo.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        // This is the relative URL the frontend will use, e.g. /uploads/journal/<filename>
        return "/uploads/journal/" + filename;
    }

    public List<GrowthJournal> getEntries(
            Long plantId
    ) {
        return repository
                .findByPlantIdOrderByEntryDateDesc(
                        plantId
                );
    }

    public void deleteEntry(Long entryId) {
        repository.deleteById(entryId);
    }
}
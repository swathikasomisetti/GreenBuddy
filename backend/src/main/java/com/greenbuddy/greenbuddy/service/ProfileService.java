package com.greenbuddy.greenbuddy.service;

import com.greenbuddy.greenbuddy.dto.profile.ProfileResponse;
import com.greenbuddy.greenbuddy.dto.profile.UpdateProfileRequest;
import com.greenbuddy.greenbuddy.model.GrowthJournal;
import com.greenbuddy.greenbuddy.model.User;
import com.greenbuddy.greenbuddy.repository.UserRepository;
import com.greenbuddy.greenbuddy.repository.GrowthJournalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.greenbuddy.greenbuddy.repository.PlantRepository;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ProfileService {
    private final PlantRepository plantRepository;
    private final GrowthJournalRepository growthJournalRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Folder where uploaded avatars are stored (configure in application.properties)
    // e.g.  upload.dir=uploads
    @Value("${upload.dir:uploads}")
    private String uploadDir;

    // ── helpers ────────────────────────────────────────────────

    /** Returns the first (and only) user. Replace with JWT-based lookup later. */
    private User getCurrentUser() {
        return userRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No user found"));
    }

    private ProfileResponse toResponse(User user) {
        return ProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .city(user.getCity())
                .experienceLevel(user.getExperienceLevel())
                .build();
    }

    // ── public methods ─────────────────────────────────────────

    public ProfileResponse getProfile() {
        return toResponse(getCurrentUser());
    }

    public ProfileResponse updateProfile(UpdateProfileRequest req) {
        User user = getCurrentUser();

        if (req.getName() != null && !req.getName().isBlank())
            user.setName(req.getName());

        if (req.getBio() != null)
            user.setBio(req.getBio());

        if (req.getCity() != null)
            user.setCity(req.getCity());

        if (req.getExperienceLevel() != null)
            user.setExperienceLevel(req.getExperienceLevel());

        return toResponse(userRepository.save(user));
    }

    public void changePassword(String currentPassword, String newPassword) {
        User user = getCurrentUser();

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (newPassword == null || newPassword.length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public String uploadAvatar(MultipartFile file) {
        try {
            // Create uploads/avatars directory if needed
            Path avatarDir = Paths.get(uploadDir, "avatars");
            Files.createDirectories(avatarDir);

            // Generate a unique filename so old files aren't overwritten
            String ext = "";
            String original = file.getOriginalFilename();
            if (original != null && original.contains(".")) {
                ext = original.substring(original.lastIndexOf('.'));
            }
            String filename = UUID.randomUUID() + ext;

            // Save file to disk
            Path destination = avatarDir.resolve(filename);
            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            // Build the URL the frontend will use
            String avatarUrl = "/uploads/avatars/" + filename;

            // Persist on the user
            User user = getCurrentUser();
            user.setAvatarUrl(avatarUrl);
            userRepository.save(user);

            return avatarUrl;

        } catch (IOException e) {
            throw new RuntimeException("Failed to save avatar: " + e.getMessage());
        }
    }

    /**
     * Returns simple activity stats.
     * Adjust the repository calls to match your actual Plant / JournalEntry repos.
     */
   public Map<String, Object> getStats() {

    long plantCount =
            plantRepository.count();

    long journalCount =
            growthJournalRepository.count();

    long favoritePlants =
            plantRepository.countByFavoriteTrue();

    long healthyPlants =
            plantRepository.findAll()
                    .stream()
                    .filter(p ->
                            "Healthy".equalsIgnoreCase(
                                    p.getHealthStatus()))
                    .count();

    Map<String, Object> stats =
            new HashMap<>();

    stats.put("plantCount", plantCount);
    stats.put("journalCount", journalCount);
    stats.put("favoritePlants", favoritePlants);
    stats.put("healthyPlants", healthyPlants);

    return stats;
}
private int calculateStreak() {

    List<GrowthJournal> entries =
            growthJournalRepository.findAll()
                    .stream()
                    .sorted((a, b) ->
                            b.getEntryDate().compareTo(a.getEntryDate()))
                    .toList();

    if (entries.isEmpty()) {
        return 0;
    }

    LocalDate expected = LocalDate.now();
    int streak = 0;

    for (GrowthJournal entry : entries) {

        if (entry.getEntryDate().equals(expected)) {
            streak++;
            expected = expected.minusDays(1);
        }
    }

    return streak;
}
}
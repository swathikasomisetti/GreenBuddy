package com.greenbuddy.greenbuddy.controller;

import com.greenbuddy.greenbuddy.dto.profile.ProfileResponse;
import com.greenbuddy.greenbuddy.dto.profile.UpdateProfileRequest;
import com.greenbuddy.greenbuddy.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProfileController {

    private final ProfileService profileService;

    // ── GET profile ────────────────────────────────────────────
    @GetMapping
    public ProfileResponse getProfile() {
        return profileService.getProfile();
    }

    // ── UPDATE name / bio / city / experienceLevel ─────────────
    @PutMapping
    public ProfileResponse updateProfile(@RequestBody UpdateProfileRequest req) {
        return profileService.updateProfile(req);
    }

    // ── CHANGE password ────────────────────────────────────────
    @PutMapping("/change-password")
    public ResponseEntity<Map<String, String>> changePassword(
            @RequestBody UpdateProfileRequest req) {
        profileService.changePassword(req.getCurrentPassword(), req.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password updated successfully"));
    }

    // ── UPLOAD avatar ──────────────────────────────────────────
    @PostMapping("/upload-avatar")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @RequestParam("avatar") MultipartFile file) {
        String avatarUrl = profileService.uploadAvatar(file);
        return ResponseEntity.ok(Map.of("avatarUrl", avatarUrl));
    }

    // ── GET stats (plant count, journal entries, streak) ───────
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(profileService.getStats());
    }
}
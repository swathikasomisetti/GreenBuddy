package com.greenbuddy.greenbuddy.controller;

import com.greenbuddy.greenbuddy.dto.auth.JwtResponse;
import com.greenbuddy.greenbuddy.dto.auth.LoginRequest;
import com.greenbuddy.greenbuddy.dto.auth.RegisterRequest;
import com.greenbuddy.greenbuddy.model.User;
import com.greenbuddy.greenbuddy.service.AuthService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public User register(
            @RequestBody RegisterRequest request) {

        System.out.println("REGISTER API HIT");

        return authService.register(request);
    }

    @PostMapping("/login")
    public JwtResponse login(
            @RequestBody LoginRequest request) {

        System.out.println("LOGIN API HIT");

        return authService.login(request);
    }
}
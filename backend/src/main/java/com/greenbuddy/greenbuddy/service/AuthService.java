package com.greenbuddy.greenbuddy.service;

import com.greenbuddy.greenbuddy.dto.auth.LoginRequest;
import com.greenbuddy.greenbuddy.dto.auth.JwtResponse;
import com.greenbuddy.greenbuddy.dto.auth.RegisterRequest;
import com.greenbuddy.greenbuddy.model.Role;
import com.greenbuddy.greenbuddy.model.User;
import com.greenbuddy.greenbuddy.repository.UserRepository;
import com.greenbuddy.greenbuddy.security.JwtService;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public User register(RegisterRequest request) {

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()))
                .role(Role.USER)
                .build();

        return userRepository.save(user);
    }

    public JwtResponse login(LoginRequest request) {

    System.out.println("EMAIL = " + request.getEmail());

    User user = userRepository.findByEmail(
            request.getEmail())
            .orElseThrow(() ->
                    new RuntimeException(
                            "User not found"));

    System.out.println("USER FOUND");

    if (!passwordEncoder.matches(
            request.getPassword(),
            user.getPassword())) {

        System.out.println("PASSWORD FAILED");

        throw new RuntimeException(
                "Invalid password");
    }

    System.out.println("PASSWORD MATCHED");

    String token =
            jwtService.generateToken(
                    user.getEmail());

    return new JwtResponse(token);
}
}
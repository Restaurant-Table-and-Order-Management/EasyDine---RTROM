package com.easydine.auth.service;

import com.easydine.auth.dto.AuthResponse;
import com.easydine.auth.dto.LoginRequest;
import com.easydine.auth.dto.SignupRequest;
import com.easydine.auth.entity.Role;
import com.easydine.auth.entity.User;
import com.easydine.auth.repository.UserRepository;
import com.easydine.config.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final java.util.Map<String, ResetToken> resetTokens = new ConcurrentHashMap<>();
    private final java.util.Map<String, Deque<Long>> rateLimits = new ConcurrentHashMap<>();

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Data
    @AllArgsConstructor
    private static class ResetToken {
        private String email;
        private Instant expiry;
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.CUSTOMER)
                .build();

        userRepository.save(user);
        var jwtToken = jwtUtil.generateToken(user);
        
        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        var jwtToken = jwtUtil.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .build();
    }

    public void forgotPassword(String email) {
        // Basic Rate Limiting: 3 requests per hour
        long now = Instant.now().getEpochSecond();
        Deque<Long> attempts = rateLimits.computeIfAbsent(email, k -> new ArrayDeque<>());
        
        // Remove attempts older than 1 hour (3600 seconds)
        while (!attempts.isEmpty() && now - attempts.peekFirst() > 3600) {
            attempts.pollFirst();
        }

        if (attempts.size() >= 3) {
            throw new RuntimeException("Too many reset requests. Please try again later.");
        }
        attempts.addLast(now);

        // Security: Silent return if user not found (Generic response)
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            System.out.println("DEBUG: Password reset requested for non-existent email: " + email + ". Returning generic success.");
            return;
        }

        // Generate secure token
        String token = UUID.randomUUID().toString();
        resetTokens.put(token, new ResetToken(email, Instant.now().plusSeconds(900))); // 15 mins expiry
        
        // Simulated User-Friendly Email Content
        System.out.println("--------------------------------------------------");
        System.out.println("SUBJECT: Password Reset Request");
        System.out.println("BODY: Click the link below to reset your password. This link will expire in 15 minutes.");
        System.out.println("LINK: http://localhost:5173/reset-password?token=" + token);
        System.out.println("--------------------------------------------------");
    }

    public void resetPassword(String token, String newPassword) {
        ResetToken resetData = resetTokens.get(token);
        
        if (resetData == null || Instant.now().isAfter(resetData.getExpiry())) {
            if (resetData != null) resetTokens.remove(token); // Cleanup expired
            throw new RuntimeException("Invalid or expired reset token");
        }
        
        var user = userRepository.findByEmail(resetData.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate new password (6+ chars, letter, number, special char)
        validatePassword(newPassword);

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        // Invalidate token (One-time use)
        resetTokens.remove(token);
        System.out.println("DEBUG: Password reset successfully for: " + resetData.getEmail());
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }
        if (!password.matches(".*[a-zA-Z].*") || !password.matches(".*\\d.*")) {
            throw new RuntimeException("Password must include both letters and numbers");
        }
        if (!password.matches(".*[!@#$%^&*()_+\\-={}|;':\",./<>?\\[\\]\\\\`~].*")) {
            throw new RuntimeException("Password must include at least one special character");
        }
    }
}

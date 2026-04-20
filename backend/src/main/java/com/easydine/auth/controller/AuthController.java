package com.easydine.auth.controller;

import com.easydine.auth.dto.AuthResponse;
import com.easydine.auth.dto.LoginRequest;
import com.easydine.auth.dto.SignupRequest;
import com.easydine.auth.service.AuthService;
import com.easydine.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Login successful", authService.login(request)));
    }

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Signup successful", authService.signup(request)));
    }
}

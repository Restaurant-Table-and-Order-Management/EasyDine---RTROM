package com.easydine.auth.controller;

import com.easydine.auth.dto.AuthResponse;
import com.easydine.auth.dto.LoginRequest;
import com.easydine.auth.dto.SignupRequest;
import com.easydine.auth.service.AuthService;
import com.easydine.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.*;
=======
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

<<<<<<< HEAD
=======
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(ApiResponse.success("User registered successfully", authService.signup(request)));
    }

>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Login successful", authService.login(request)));
    }
<<<<<<< HEAD

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<AuthResponse>> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Signup successful", authService.signup(request)));
    }
=======
>>>>>>> 7fb00877791e8f1b2561430cfe5fc479d2029c77
}

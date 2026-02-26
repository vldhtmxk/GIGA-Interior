package com.demo.domain.admin.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.demo.domain.admin.dto.request.AdminLoginRequest;
import com.demo.domain.admin.dto.response.AdminAuthResponse;
import com.demo.domain.admin.service.AdminAuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

    private final AdminAuthService adminAuthService;

    @PostMapping("/login")
    public AdminAuthResponse login(@RequestBody AdminLoginRequest request) {
        return adminAuthService.login(request);
    }

    @GetMapping("/me")
    public AdminAuthResponse.AdminProfile me(@RequestHeader(name = "Authorization", required = false) String authorization) {
        return adminAuthService.me(authorization);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@RequestHeader(name = "Authorization", required = false) String authorization) {
        adminAuthService.logout(authorization);
    }
}


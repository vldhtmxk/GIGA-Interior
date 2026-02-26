package com.demo.domain.admin.dto.response;

public record AdminAuthResponse(
    String accessToken,
    AdminProfile admin
) {
    public record AdminProfile(
        Long adminId,
        String username,
        String name,
        String role
    ) {}
}


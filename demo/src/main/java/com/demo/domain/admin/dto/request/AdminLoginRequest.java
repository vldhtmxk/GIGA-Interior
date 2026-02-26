package com.demo.domain.admin.dto.request;

public record AdminLoginRequest(
    String username,
    String password
) {
}


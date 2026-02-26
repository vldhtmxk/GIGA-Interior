package com.demo.domain.admin.service;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.demo.domain.admin.entity.AdminUser;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class AdminJwtTokenService {

    private final SecretKey signingKey;
    private final long expirationSeconds;

    public AdminJwtTokenService(
        @Value("${app.admin.auth.jwt.secret:local-dev-admin-jwt-secret-change-me-32chars}") String secret,
        @Value("${app.admin.auth.jwt.expiration-seconds:43200}") long expirationSeconds
    ) {
        byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (secretBytes.length < 32) {
            throw new IllegalStateException("app.admin.auth.jwt.secret must be at least 32 bytes.");
        }
        this.signingKey = Keys.hmacShaKeyFor(secretBytes);
        this.expirationSeconds = Math.max(expirationSeconds, 60);
    }

    public String issue(AdminUser admin) {
        Instant now = Instant.now();
        return Jwts.builder()
            .subject(String.valueOf(admin.getAdminId()))
            .claim("username", admin.getUsername())
            .claim("role", admin.getRole())
            .issuedAt(Date.from(now))
            .expiration(Date.from(now.plusSeconds(expirationSeconds)))
            .signWith(signingKey)
            .compact();
    }

    public Long extractAdminId(String rawToken) {
        String token = extractBearerToken(rawToken);
        if (token == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "인증 토큰이 없습니다.");
        }
        try {
            Claims claims = Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
            return Long.parseLong(claims.getSubject());
        } catch (JwtException | IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다.");
        }
    }

    public String extractBearerToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return null;
        }
        if (rawToken.regionMatches(true, 0, "Bearer ", 0, 7)) {
            return rawToken.substring(7).trim();
        }
        return rawToken.trim();
    }
}

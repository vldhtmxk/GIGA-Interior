package com.demo.domain.admin.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.demo.domain.admin.dto.request.AdminLoginRequest;
import com.demo.domain.admin.dto.response.AdminAuthResponse;
import com.demo.domain.admin.entity.AdminUser;
import com.demo.domain.admin.repository.AdminUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminAuthService {

    private final AdminUserRepository adminUserRepository;
    private final AdminJwtTokenService adminJwtTokenService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    @Value("${app.admin.auth.password.allow-plaintext-auto-migrate:false}")
    private boolean allowPlaintextAutoMigrate;

    @Transactional
    public AdminAuthResponse login(AdminLoginRequest request) {
        if (request == null || isBlank(request.username()) || isBlank(request.password())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "아이디와 비밀번호를 입력해주세요.");
        }

        AdminUser admin = adminUserRepository.findByUsernameAndIsActiveTrue(request.username().trim())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!verifyPasswordAndMigrateIfNeeded(admin, request.password())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        admin.setLastLoginAt(LocalDateTime.now());
        adminUserRepository.save(admin);

        String token = adminJwtTokenService.issue(admin);
        return new AdminAuthResponse(token, toProfile(admin));
    }

    @Transactional(readOnly = true)
    public AdminAuthResponse.AdminProfile me(String token) {
        AdminUser admin = getAdminByToken(token);
        return toProfile(admin);
    }

    public void logout(String token) {
        // Stateless JWT mode: client token disposal is sufficient.
        // Validate format if provided to keep previous endpoint semantics.
        if (token != null && !token.isBlank()) {
            adminJwtTokenService.extractAdminId(token);
        }
    }

    @Transactional(readOnly = true)
    protected AdminUser getAdminByToken(String rawToken) {
        Long adminId = adminJwtTokenService.extractAdminId(rawToken);
        return adminUserRepository.findById(adminId)
            .filter(AdminUser::getIsActive)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."));
    }

    private boolean verifyPasswordAndMigrateIfNeeded(AdminUser admin, String rawPassword) {
        String stored = admin.getPasswordHash();
        if (stored == null || stored.isBlank()) {
            return false;
        }
        if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
            return passwordEncoder.matches(rawPassword, stored);
        }
        if (allowPlaintextAutoMigrate && stored.equals(rawPassword)) {
            admin.setPasswordHash(passwordEncoder.encode(rawPassword));
            adminUserRepository.save(admin);
            return true;
        }
        throw new ResponseStatusException(
            HttpStatus.UNAUTHORIZED,
            "관리자 비밀번호 해시 형식이 올바르지 않습니다. bcrypt 해시로 마이그레이션이 필요합니다."
        );
    }

    private AdminAuthResponse.AdminProfile toProfile(AdminUser admin) {
        return new AdminAuthResponse.AdminProfile(
            admin.getAdminId(),
            admin.getUsername(),
            admin.getName(),
            admin.getRole()
        );
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}

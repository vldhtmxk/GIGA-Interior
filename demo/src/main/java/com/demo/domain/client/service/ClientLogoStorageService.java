package com.demo.domain.client.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ClientLogoStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp", "gif", "svg");

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public String saveLogo(MultipartFile file, Long clientId) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "업로드할 로고 파일을 선택해주세요.");
        }

        String originalName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        String extension = extractExtension(originalName);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 로고 형식입니다. (jpg, jpeg, png, webp, gif, svg)");
        }

        try {
            Path baseDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path dir = baseDir.resolve("clients");
            Files.createDirectories(dir);

            String fileName = "client-" + clientId + "-" + UUID.randomUUID() + "." + extension;
            Path destination = dir.resolve(fileName).normalize();
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, destination, StandardCopyOption.REPLACE_EXISTING);
            }
            return "/uploads/clients/" + fileName;
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "로고 이미지 저장에 실패했습니다.");
        }
    }

    public void deleteLogoFile(String logoUrl) {
        if (logoUrl == null || logoUrl.isBlank()) return;
        String normalizedUrl = logoUrl.replace("\\", "/");
        String prefix = "/uploads/";
        int prefixIndex = normalizedUrl.indexOf(prefix);
        if (prefixIndex < 0) return;

        String relativePath = normalizedUrl.substring(prefixIndex + prefix.length());
        if (relativePath.isBlank()) return;

        try {
            Path baseDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path target = baseDir.resolve(relativePath).normalize();
            if (!target.startsWith(baseDir)) return;
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
            // ignore cleanup failure
        }
    }

    private String extractExtension(String fileName) {
        int index = fileName.lastIndexOf('.');
        if (index < 0 || index == fileName.length() - 1) return "";
        return fileName.substring(index + 1).toLowerCase();
    }
}

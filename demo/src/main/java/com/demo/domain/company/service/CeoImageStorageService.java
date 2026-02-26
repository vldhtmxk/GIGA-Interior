package com.demo.domain.company.service;

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
public class CeoImageStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp", "gif");

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public String save(MultipartFile file, Long ceoInfoId) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "업로드할 CEO 이미지를 선택해주세요.");
        }

        String originalName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        String ext = extractExtension(originalName);
        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 이미지 형식입니다. (jpg, jpeg, png, webp, gif)");
        }

        try {
            Path baseDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path dir = baseDir.resolve("ceo");
            Files.createDirectories(dir);
            String fileName = "ceo-" + ceoInfoId + "-" + UUID.randomUUID() + "." + ext;
            Path target = dir.resolve(fileName).normalize();
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
            }
            return "/uploads/ceo/" + fileName;
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "CEO 이미지 저장에 실패했습니다.");
        }
    }

    public void deleteFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return;
        String normalized = imageUrl.replace("\\", "/");
        String prefix = "/uploads/";
        int idx = normalized.indexOf(prefix);
        if (idx < 0) return;
        String relativePath = normalized.substring(idx + prefix.length());
        if (relativePath.isBlank()) return;
        try {
            Path baseDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path target = baseDir.resolve(relativePath).normalize();
            if (!target.startsWith(baseDir)) return;
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
        }
    }

    private String extractExtension(String fileName) {
        int idx = fileName.lastIndexOf('.');
        if (idx < 0 || idx == fileName.length() - 1) return "";
        return fileName.substring(idx + 1).toLowerCase();
    }
}

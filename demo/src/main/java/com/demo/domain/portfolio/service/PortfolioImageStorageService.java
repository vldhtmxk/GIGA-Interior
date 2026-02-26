package com.demo.domain.portfolio.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.demo.domain.portfolio.entity.Portfolio;
import com.demo.domain.portfolio.entity.PortfolioImage;

@Service
public class PortfolioImageStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp", "gif");

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public List<PortfolioImage> saveImages(Portfolio portfolio, List<MultipartFile> files, int startOrder) {
        if (files == null || files.isEmpty()) return List.of();

        List<PortfolioImage> saved = new ArrayList<>();
        int orderIndex = startOrder;
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) continue;
            saved.add(saveOne(portfolio, file, orderIndex++));
        }
        return saved;
    }

    public void deleteImageFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) return;
        String normalizedUrl = imageUrl.replace("\\", "/");
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
            // DB delete should not fail because physical file cleanup failed.
        }
    }

    private PortfolioImage saveOne(Portfolio portfolio, MultipartFile file, int orderIndex) {
        String originalName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        String extension = extractExtension(originalName);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "지원하지 않는 이미지 형식입니다. (jpg, jpeg, png, webp, gif): " + originalName
            );
        }

        try {
            Path baseDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path dir = baseDir.resolve("portfolios");
            Files.createDirectories(dir);

            String fileName = "portfolio-" + portfolio.getPortfolioId() + "-" + UUID.randomUUID() + "." + extension;
            Path destination = dir.resolve(fileName).normalize();
            try (InputStream in = file.getInputStream()) {
                Files.copy(in, destination, StandardCopyOption.REPLACE_EXISTING);
            }

            PortfolioImage image = new PortfolioImage();
            image.setPortfolio(portfolio);
            image.setImageUrl("/uploads/portfolios/" + fileName);
            image.setAltText(portfolio.getTitle());
            image.setOrderIndex(orderIndex);
            return image;
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "포트폴리오 이미지 저장에 실패했습니다.");
        }
    }

    private String extractExtension(String fileName) {
        int idx = fileName.lastIndexOf('.');
        if (idx < 0 || idx == fileName.length() - 1) return "";
        return fileName.substring(idx + 1).toLowerCase();
    }
}

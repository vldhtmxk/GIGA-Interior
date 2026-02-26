package com.demo.domain.applicant.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.demo.domain.applicant.entity.Applicant;
import com.demo.domain.applicant.entity.ApplicantFile;

@Service
public class ApplicantFileStorageService {

    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "doc", "docx", "jpg", "jpeg", "png");
    private static final long MAX_FILE_SIZE = 10L * 1024 * 1024;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public List<ApplicantFile> saveApplicantFiles(Applicant applicant, List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            return List.of();
        }

        return files.stream()
            .filter(file -> file != null && !file.isEmpty())
            .map(file -> saveOne(applicant, file))
            .toList();
    }

    private ApplicantFile saveOne(Applicant applicant, MultipartFile file) {
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "첨부 파일은 10MB 이하만 업로드할 수 있습니다.");
        }

        String originalName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();
        String extension = extractExtension(originalName);
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 첨부파일 형식입니다.");
        }

        try {
            Path baseDir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path applicantDir = baseDir.resolve("applicants");
            Files.createDirectories(applicantDir);

            String fileName = "applicant-" + applicant.getApplicantId() + "-" + UUID.randomUUID() + "." + extension;
            Path destination = applicantDir.resolve(fileName).normalize();

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
            }

            ApplicantFile applicantFile = new ApplicantFile();
            applicantFile.setApplicant(applicant);
            applicantFile.setFileName(originalName.isBlank() ? fileName : originalName);
            applicantFile.setFileType(file.getContentType());
            applicantFile.setFileUrl("/uploads/applicants/" + fileName);
            return applicantFile;
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "첨부 파일 저장에 실패했습니다.");
        }
    }

    private String extractExtension(String fileName) {
        int index = fileName.lastIndexOf('.');
        if (index < 0 || index == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(index + 1).toLowerCase();
    }
}


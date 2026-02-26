package com.demo.domain.applicant.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.demo.domain.applicant.entity.Applicant;

public record ApplicantResponse(
    Long applicantId,
    Long recruitId,
    String recruitPosition,
    String name,
    String email,
    String phone,
    String status,
    String experience,
    String education,
    String portfolio,
    String motivation,
    String salary,
    LocalDateTime availableDate,
    String adminComment,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    List<ApplicantFileResponse> files
) {
    public static ApplicantResponse from(Applicant applicant) {
        return new ApplicantResponse(
            applicant.getApplicantId(),
            applicant.getRecruit() == null ? null : applicant.getRecruit().getRecruitId(),
            applicant.getRecruit() == null ? null : applicant.getRecruit().getPosition(),
            applicant.getName(),
            applicant.getEmail(),
            applicant.getPhone(),
            applicant.getStatus(),
            applicant.getCareer_summary(),
            applicant.getEducation(),
            applicant.getCoverLetter(),
            applicant.getMovication(),
            applicant.getDesireSalary(),
            applicant.getAvailableDate(),
            applicant.getAdminComment(),
            applicant.getCreatedAt(),
            applicant.getUpdatedAt(),
            applicant.getApplicantFiles() == null
                ? List.of()
                : applicant.getApplicantFiles().stream().map(ApplicantFileResponse::from).toList()
        );
    }
}


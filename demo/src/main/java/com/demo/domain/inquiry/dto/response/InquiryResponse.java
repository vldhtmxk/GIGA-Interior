package com.demo.domain.inquiry.dto.response;

import java.time.LocalDateTime;

import com.demo.domain.inquiry.entity.Inquiry;

public record InquiryResponse(
    Long inquiryId,
    String name,
    String email,
    String phone,
    String projectType,
    String budgetRange,
    String message,
    String status,
    String adminMemo,
    LocalDateTime repliedAt,
    String repliedBy,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static InquiryResponse from(Inquiry inquiry) {
        return new InquiryResponse(
            inquiry.getInquiryId(),
            inquiry.getName(),
            inquiry.getEmail(),
            inquiry.getPhone(),
            inquiry.getProjectType(),
            inquiry.getBudgetRange(),
            inquiry.getMessage(),
            inquiry.getStatus() == null ? null : inquiry.getStatus().name(),
            inquiry.getAdminMemo(),
            inquiry.getRepliedAt(),
            inquiry.getRepliedBy(),
            inquiry.getCreatedAt(),
            inquiry.getUpdatedAt()
        );
    }
}

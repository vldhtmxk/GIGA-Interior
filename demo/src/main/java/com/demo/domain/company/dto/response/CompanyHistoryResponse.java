package com.demo.domain.company.dto.response;

import java.time.LocalDateTime;

import com.demo.domain.company.entity.CompanyHistory;

public record CompanyHistoryResponse(
    Long historyId,
    Integer year,
    String title,
    String description,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static CompanyHistoryResponse from(CompanyHistory entity) {
        return new CompanyHistoryResponse(
            entity.getHistoryId(),
            entity.getYear(),
            entity.getTitle(),
            entity.getDescription(),
            entity.getCreatedAt(),
            entity.getUpdatedAt()
        );
    }
}

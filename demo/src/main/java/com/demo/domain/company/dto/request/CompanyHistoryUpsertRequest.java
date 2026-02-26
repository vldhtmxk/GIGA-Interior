package com.demo.domain.company.dto.request;

public record CompanyHistoryUpsertRequest(
    Integer year,
    String title,
    String description
) {
}

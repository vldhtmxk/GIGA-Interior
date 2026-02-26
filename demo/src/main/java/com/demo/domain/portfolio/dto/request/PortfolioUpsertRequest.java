package com.demo.domain.portfolio.dto.request;

public record PortfolioUpsertRequest(
    String title,
    String category,
    String location,
    Integer year,
    String clientName,
    String area,
    String duration,
    String description,
    String concept,
    String feature,
    String materials
) {
}


package com.demo.domain.portfolio.dto.response;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import com.demo.domain.portfolio.entity.Portfolio;

public record PortfolioResponse(
    Long portfolioId,
    String title,
    String category,
    String location,
    Integer year,
    String clientName,
    String area,
    Integer duration,
    String description,
    String concept,
    String feature,
    String materials,
    String thumbnailUrl,
    List<PortfolioImageResponse> images,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static PortfolioResponse from(Portfolio portfolio) {
        List<PortfolioImageResponse> images = portfolio.getPortfolioImages() == null
            ? List.of()
            : portfolio.getPortfolioImages().stream()
                .sorted(Comparator.comparingInt(img -> img.getOrderIndex()))
                .map(PortfolioImageResponse::from)
                .toList();

        String thumbnail = images.isEmpty() ? null : images.get(0).imageUrl();

        return new PortfolioResponse(
            portfolio.getPortfolioId(),
            portfolio.getTitle(),
            portfolio.getCategory(),
            portfolio.getLocation(),
            portfolio.getYear(),
            portfolio.getCliient(),
            portfolio.getArea(),
            portfolio.getPeriod(),
            portfolio.getDescription(),
            portfolio.getConcept(),
            portfolio.getFeature(),
            portfolio.getMaterials(),
            thumbnail,
            images,
            portfolio.getCreatedAt(),
            portfolio.getUpdatedAt()
        );
    }
}


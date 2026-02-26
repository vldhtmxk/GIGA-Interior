package com.demo.domain.carousel.dto.response;

import java.time.LocalDateTime;

import com.demo.domain.carousel.entity.MainCarousel;

public record MainCarouselResponse(
    Long carouselId,
    String title,
    String subtitle,
    String buttonText,
    String buttonLink,
    String backgroundUrl,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static MainCarouselResponse from(MainCarousel entity) {
        return new MainCarouselResponse(
            entity.getCarouselId(),
            entity.getTitle(),
            entity.getSubtitle(),
            entity.getButtonText(),
            entity.getButtonLink(),
            entity.getBackgroundUrl(),
            entity.getCreatedAt(),
            entity.getUpdatedAt()
        );
    }
}

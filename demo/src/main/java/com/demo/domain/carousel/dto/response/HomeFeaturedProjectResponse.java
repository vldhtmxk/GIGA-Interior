package com.demo.domain.carousel.dto.response;

public record HomeFeaturedProjectResponse(
    Integer slotIndex,
    Long portfolioId,
    String title,
    String category,
    String thumbnailUrl
) {
}

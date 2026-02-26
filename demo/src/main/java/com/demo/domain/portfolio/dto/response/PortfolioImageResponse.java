package com.demo.domain.portfolio.dto.response;

import com.demo.domain.portfolio.entity.PortfolioImage;

public record PortfolioImageResponse(
    Long portfolioImageId,
    String imageUrl,
    String altText,
    Integer orderIndex
) {
    public static PortfolioImageResponse from(PortfolioImage image) {
        return new PortfolioImageResponse(
            image.getPortfolioImageId(),
            image.getImageUrl(),
            image.getAltText(),
            image.getOrderIndex()
        );
    }
}


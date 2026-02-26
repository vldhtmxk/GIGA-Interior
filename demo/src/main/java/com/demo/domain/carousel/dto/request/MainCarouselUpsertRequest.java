package com.demo.domain.carousel.dto.request;

public record MainCarouselUpsertRequest(
    String title,
    String subtitle,
    String buttonText,
    String buttonLink
) {
}

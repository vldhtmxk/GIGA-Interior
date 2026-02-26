package com.demo.domain.carousel.dto.request;

import java.util.List;

public record HomeFeaturedProjectsUpdateRequest(
    List<Long> portfolioIds
) {
}

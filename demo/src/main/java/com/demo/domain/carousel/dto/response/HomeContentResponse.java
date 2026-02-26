package com.demo.domain.carousel.dto.response;

import java.util.List;

public record HomeContentResponse(
    List<MainCarouselResponse> carousels,
    List<HomeFeaturedProjectResponse> featuredProjects
) {
}

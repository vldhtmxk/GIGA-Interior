package com.demo.domain.carousel.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.demo.domain.admin.service.AdminAuthService;
import com.demo.domain.carousel.dto.request.HomeFeaturedProjectsUpdateRequest;
import com.demo.domain.carousel.dto.request.MainCarouselUpsertRequest;
import com.demo.domain.carousel.dto.response.HomeContentResponse;
import com.demo.domain.carousel.dto.response.HomeFeaturedProjectResponse;
import com.demo.domain.carousel.dto.response.MainCarouselResponse;
import com.demo.domain.carousel.service.HomeContentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/home")
public class AdminHomeContentController {

    private final HomeContentService homeContentService;
    private final AdminAuthService adminAuthService;

    @GetMapping
    public HomeContentResponse getHomeContent(@RequestHeader(name = "Authorization", required = false) String authorization) {
        adminAuthService.me(authorization);
        return homeContentService.getHomeContent();
    }

    @PostMapping("/carousels")
    @ResponseStatus(HttpStatus.CREATED)
    public MainCarouselResponse createCarousel(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @RequestBody MainCarouselUpsertRequest request
    ) {
        adminAuthService.me(authorization);
        return homeContentService.createCarousel(request);
    }

    @PutMapping("/carousels/{carouselId}")
    public MainCarouselResponse updateCarousel(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long carouselId,
        @RequestBody MainCarouselUpsertRequest request
    ) {
        adminAuthService.me(authorization);
        return homeContentService.updateCarousel(carouselId, request);
    }

    @DeleteMapping("/carousels/{carouselId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCarousel(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long carouselId
    ) {
        adminAuthService.me(authorization);
        homeContentService.deleteCarousel(carouselId);
    }

    @PostMapping("/carousels/{carouselId}/image")
    public MainCarouselResponse uploadCarouselImage(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long carouselId,
        @RequestParam("image") MultipartFile image
    ) {
        adminAuthService.me(authorization);
        return homeContentService.uploadCarouselImage(carouselId, image);
    }

    @PutMapping("/featured-projects")
    public List<HomeFeaturedProjectResponse> updateFeaturedProjects(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @RequestBody HomeFeaturedProjectsUpdateRequest request
    ) {
        adminAuthService.me(authorization);
        return homeContentService.updateFeaturedProjects(request);
    }
}

package com.demo.domain.carousel.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.domain.carousel.dto.response.HomeContentResponse;
import com.demo.domain.carousel.service.HomeContentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/home-content")
public class HomeContentController {

    private final HomeContentService homeContentService;

    @GetMapping
    public HomeContentResponse getHomeContent() {
        return homeContentService.getHomeContent();
    }
}

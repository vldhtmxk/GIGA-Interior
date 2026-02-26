package com.demo.domain.company.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.domain.company.dto.response.AboutContentResponse;
import com.demo.domain.company.service.AboutContentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/about")
public class AboutContentController {

    private final AboutContentService aboutContentService;

    @GetMapping
    public AboutContentResponse getAboutContent() {
        return aboutContentService.getAboutContent();
    }
}

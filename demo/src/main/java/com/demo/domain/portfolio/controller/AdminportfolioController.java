package com.demo.domain.portfolio.controller;

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
import com.demo.domain.portfolio.dto.request.PortfolioUpsertRequest;
import com.demo.domain.portfolio.dto.response.PortfolioResponse;
import com.demo.domain.portfolio.service.PortfolioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/portfolios")
public class AdminPortfolioController {

    private final PortfolioService portfolioService;
    private final AdminAuthService adminAuthService;

    @GetMapping
    public List<PortfolioResponse> getAll(@RequestHeader(name = "Authorization", required = false) String authorization) {
        adminAuthService.me(authorization);
        return portfolioService.getAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PortfolioResponse create(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @RequestBody PortfolioUpsertRequest request
    ) {
        adminAuthService.me(authorization);
        return portfolioService.create(request);
    }

    @PutMapping("/{portfolioId}")
    public PortfolioResponse update(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long portfolioId,
        @RequestBody PortfolioUpsertRequest request
    ) {
        adminAuthService.me(authorization);
        return portfolioService.update(portfolioId, request);
    }

    @DeleteMapping("/{portfolioId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long portfolioId
    ) {
        adminAuthService.me(authorization);
        portfolioService.delete(portfolioId);
    }

    @PostMapping("/{portfolioId}/images")
    public PortfolioResponse uploadImages(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long portfolioId,
        @RequestParam(name = "images") List<MultipartFile> images
    ) {
        adminAuthService.me(authorization);
        return portfolioService.uploadImages(portfolioId, images);
    }

    @DeleteMapping("/{portfolioId}/images/{portfolioImageId}")
    public PortfolioResponse deleteImage(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long portfolioId,
        @PathVariable Long portfolioImageId
    ) {
        adminAuthService.me(authorization);
        return portfolioService.deleteImage(portfolioId, portfolioImageId);
    }
}

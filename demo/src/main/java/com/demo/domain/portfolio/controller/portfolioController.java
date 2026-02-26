package com.demo.domain.portfolio.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.domain.portfolio.dto.response.PortfolioResponse;
import com.demo.domain.portfolio.service.PortfolioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;

    @GetMapping
    public List<PortfolioResponse> getAll() {
        return portfolioService.getAll();
    }

    @GetMapping("/{portfolioId}")
    public PortfolioResponse getOne(@PathVariable Long portfolioId) {
        return portfolioService.getOne(portfolioId);
    }
}


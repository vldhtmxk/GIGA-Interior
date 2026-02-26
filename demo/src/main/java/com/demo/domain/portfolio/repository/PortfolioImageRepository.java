package com.demo.domain.portfolio.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.domain.portfolio.entity.PortfolioImage;

public interface PortfolioImageRepository extends JpaRepository<PortfolioImage, Long> {
    Optional<PortfolioImage> findByPortfolioImageIdAndPortfolio_PortfolioId(Long portfolioImageId, Long portfolioId);
}

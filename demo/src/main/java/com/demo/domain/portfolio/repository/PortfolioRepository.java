package com.demo.domain.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.domain.portfolio.entity.Portfolio;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
}

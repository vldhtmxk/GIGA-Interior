package com.demo.domain.carousel.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.domain.carousel.entity.HomeFeaturedPortfolio;

public interface HomeFeaturedPortfolioRepository extends JpaRepository<HomeFeaturedPortfolio, Long> {
    List<HomeFeaturedPortfolio> findAllByOrderBySlotIndexAsc();
    void deleteAllBySlotIndexIn(Iterable<Integer> slotIndexes);
}

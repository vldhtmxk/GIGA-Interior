package com.demo.domain.carousel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.domain.carousel.entity.MainCarousel;

public interface MainCarouselRepository extends JpaRepository<MainCarousel, Long> {
}

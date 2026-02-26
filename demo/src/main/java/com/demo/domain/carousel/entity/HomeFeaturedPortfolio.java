package com.demo.domain.carousel.entity;

import com.demo.global.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "home_featured_portfolio")
@Getter
@Setter
public class HomeFeaturedPortfolio extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "home_featured_id")
    private Long homeFeaturedId;

    @Column(name = "slot_index", nullable = false)
    private Integer slotIndex;

    @Column(name = "portfolio_id", nullable = false)
    private Long portfolioId;
}

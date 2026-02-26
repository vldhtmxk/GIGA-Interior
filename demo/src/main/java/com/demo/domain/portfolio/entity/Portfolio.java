
package com.demo.domain.portfolio.entity;


import java.util.ArrayList;
import java.util.List;

import com.demo.global.entity.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Portfolio extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long portfolioId;

    private String title;
    private String location;
    private int year;
    private String area;
    private String cliient;
    private int period;
    private String category;
    private String description;
    private String concept;
    private String feature;
    private String materials;

    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL , orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PortfolioImage> portfolioImages = new ArrayList<>();
}

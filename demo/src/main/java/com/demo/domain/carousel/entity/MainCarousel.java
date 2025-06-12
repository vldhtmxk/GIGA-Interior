package com.demo.domain.carousel.entity;

import com.demo.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "main_carousel")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MainCarousel extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "carousel_id")
    private Long carouselId;

    @Column(length = 200, nullable = false)
    private String title;

    @Column(length = 255)
    private String subtitle;

    @Column(name = "button_text", length = 60)
    private String buttonText;

    @Column(name = "button_link", length = 255)
    private String buttonLink;

    @Column(name = "background_url", length = 255)
    private String backgroundUrl;
}
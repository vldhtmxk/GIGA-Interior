package com.demo.domain.company.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "company_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "company_id")
    private Long companyId;

    @Column(name = "company_name", length = 100, nullable = false)
    private String companyName;

    @Column(name = "ceo_name", length = 50)
    private String ceoName;

    @Column(name = "business_number", length = 50)
    private String businessNumber;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String email;

    @Column(length = 255)
    private String address;

    @Column(name = "map_embed_url", columnDefinition = "TEXT")
    private String mapEmbedUrl;

    @Column(name = "opening_hours", length = 100)
    private String openingHours;

    @Column(name = "instagram_url", length = 255)
    private String instagramUrl;

    @Column(name = "facebook_url", length = 255)
    private String facebookUrl;

    @Column(name = "youtube_url", length = 255)
    private String youtubeUrl;

    @Column(name = "blog_url", length = 255)
    private String blogUrl;
}
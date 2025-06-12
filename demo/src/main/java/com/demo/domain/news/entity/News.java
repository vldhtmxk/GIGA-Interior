package com.demo.domain.news.entity;

import com.demo.domain.news.enums.NewsStatus;
import com.demo.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "news")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class News extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "news_id")
    private Long newsId;

    @Column(length = 200, nullable = false)
    private String title;

    @Column(length = 50)
    private String category;

    @Column(length = 100)
    private String author;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "is_featured")
    private Boolean isFeatured;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NewsStatus status;

    private int hit;
}
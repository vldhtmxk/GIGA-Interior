package com.demo.domain.faq.entity;

import com.demo.domain.faq.enums.FaqVisibility;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "faq")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Faq {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "faq_id")
    private Long faqId;

    @Column(length = 255, nullable = false)
    private String question;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String answer;

    @Column(length = 50)
    private String category;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_visible", nullable = false)
    private FaqVisibility isVisible;
}
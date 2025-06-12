package com.demo.domain.inquiry.entity;

import com.demo.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "inquiry")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inquiry extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inquiry_id")
    private Long inquiryId;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "project_type", length = 100)
    private String projectType;

    @Column(name = "budget_range", length = 100)
    private String budgetRange;

    @Column(columnDefinition = "TEXT")
    private String message;
}
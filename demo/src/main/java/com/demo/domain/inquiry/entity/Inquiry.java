package com.demo.domain.inquiry.entity;

import java.time.LocalDateTime;

import com.demo.domain.inquiry.enums.InquiryStatus;
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

    @Enumerated(EnumType.STRING)
    @Column(length = 30, nullable = false)
    @Builder.Default
    private InquiryStatus status = InquiryStatus.NEW;

    @Column(name = "admin_memo", columnDefinition = "TEXT")
    private String adminMemo;

    @Column(name = "replied_at")
    private LocalDateTime repliedAt;

    @Column(name = "replied_by", length = 100)
    private String repliedBy;
}

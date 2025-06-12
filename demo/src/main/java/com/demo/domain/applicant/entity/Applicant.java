package com.demo.domain.applicant.entity;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.demo.global.entity.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Applicant extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long applicantId;

    private String name;
    private String email;
    private String phone;
    private String coverLetter;
    private String status;
    private String career_summary; //경력 요약
    private String education; // 학력
    private String movication; // 지원 동기
    private LocalDateTime availableDate; // 입사 가능일
    private String desireSalary; // 희망 연봉
    private String adminComment; // 관리자 코멘트


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recruit_id")
    private long recruitId;

    @OneToMany(mappedBy = "applicantId", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ApplicantFile> applicantFiles = new ArrayList<>();
}

package com.demo.domain.recruit.entity;

import java.time.LocalDateTime;
import java.util.List;

import com.demo.domain.applicant.entity.Applicant;
import com.demo.global.entity.BaseEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Recruit extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long recruitId;

    private String position;
    private String department;
    private String empType;
    private String career_level;
    private String location;
    private LocalDateTime deadline;
    private String description;
    @Column(length = 500)
    private String imageUrl;
    private int isVisible;
    private int hit;

    @OneToMany(mappedBy = "recruit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Applicant> applicants;

    
}

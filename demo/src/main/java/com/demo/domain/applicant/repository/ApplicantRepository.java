package com.demo.domain.applicant.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.domain.applicant.entity.Applicant;

public interface ApplicantRepository extends JpaRepository<Applicant, Long> {
    List<Applicant> findByRecruit_RecruitIdOrderByApplicantIdDesc(Long recruitId);
}


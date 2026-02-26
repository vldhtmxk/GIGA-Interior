package com.demo.domain.recruit.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.domain.recruit.entity.Recruit;

public interface RecruitRepository extends JpaRepository<Recruit, Long> {
    List<Recruit> findByIsVisibleOrderByCreatedAtDesc(int isVisible);
}


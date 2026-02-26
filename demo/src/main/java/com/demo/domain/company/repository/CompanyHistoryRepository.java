package com.demo.domain.company.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.domain.company.entity.CompanyHistory;

public interface CompanyHistoryRepository extends JpaRepository<CompanyHistory, Long> {
}

package com.demo.domain.ceo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.domain.ceo.entity.CeoInfo;

public interface CeoInfoRepository extends JpaRepository<CeoInfo, Long> {
    Optional<CeoInfo> findTopByOrderByCeoInfoIdAsc();
}

package com.demo.domain.inquiry.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.demo.domain.inquiry.enums.InquiryStatus;

import com.demo.domain.inquiry.entity.Inquiry;

public interface InquiryRepository extends JpaRepository<Inquiry, Long>, JpaSpecificationExecutor<Inquiry> {
    long countByStatus(InquiryStatus status);
    java.util.Optional<Inquiry> findTopByInquiryIdLessThanOrderByInquiryIdDesc(Long inquiryId);
    java.util.Optional<Inquiry> findTopByInquiryIdGreaterThanOrderByInquiryIdAsc(Long inquiryId);
}

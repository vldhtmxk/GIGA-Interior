package com.demo.domain.inquiry.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.domain.inquiry.entity.InquiryMemoHistory;

public interface InquiryMemoHistoryRepository extends JpaRepository<InquiryMemoHistory, Long> {
    List<InquiryMemoHistory> findByInquiry_InquiryIdOrderByMemoHistoryIdDesc(Long inquiryId);
}

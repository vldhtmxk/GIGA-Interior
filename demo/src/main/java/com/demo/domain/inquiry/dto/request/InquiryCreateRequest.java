package com.demo.domain.inquiry.dto.request;

public record InquiryCreateRequest(
    String name,
    String email,
    String phone,
    String projectType,
    String budgetRange,
    String message
) {
}


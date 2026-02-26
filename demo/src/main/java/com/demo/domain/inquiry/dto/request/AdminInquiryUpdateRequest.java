package com.demo.domain.inquiry.dto.request;

public record AdminInquiryUpdateRequest(
    String status,
    String adminMemo
) {
}


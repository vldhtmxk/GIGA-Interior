package com.demo.domain.inquiry.dto.response;

import java.util.List;
import java.util.Map;

public record AdminInquiryListResponse(
    List<InquiryResponse> items,
    int page,
    int size,
    long totalElements,
    int totalPages,
    Map<String, Long> statusCounts
) {
}

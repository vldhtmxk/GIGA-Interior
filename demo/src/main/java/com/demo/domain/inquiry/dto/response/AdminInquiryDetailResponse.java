package com.demo.domain.inquiry.dto.response;

import java.util.List;

public record AdminInquiryDetailResponse(
    InquiryResponse inquiry,
    List<InquiryMemoHistoryResponse> memoHistories,
    Long previousInquiryId,
    Long nextInquiryId
) {
}

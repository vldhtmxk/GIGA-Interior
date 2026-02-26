package com.demo.domain.inquiry.dto.response;

import java.time.LocalDateTime;

import com.demo.domain.inquiry.entity.InquiryMemoHistory;

public record InquiryMemoHistoryResponse(
    Long memoHistoryId,
    String adminName,
    String previousMemo,
    String nextMemo,
    LocalDateTime createdAt
) {
    public static InquiryMemoHistoryResponse from(InquiryMemoHistory entity) {
        return new InquiryMemoHistoryResponse(
            entity.getMemoHistoryId(),
            entity.getAdminName(),
            entity.getPreviousMemo(),
            entity.getNextMemo(),
            entity.getCreatedAt()
        );
    }
}

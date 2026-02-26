package com.demo.domain.inquiry.dto.request;

public record AdminInquiryReplyEmailRequest(
    String subject,
    String body,
    Boolean markDone
) {
}

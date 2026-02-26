package com.demo.domain.applicant.dto.request;

public record AdminApplicantUpdateRequest(
    String status,
    String adminComment
) {
}


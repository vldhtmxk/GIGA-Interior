package com.demo.domain.applicant.dto.request;

public record ApplicantCreateRequest(
    String name,
    String email,
    String phone,
    String experience,
    String education,
    String portfolio,
    String motivation,
    String salary,
    String startDate
) {
}


package com.demo.domain.recruit.dto.request;

public record AdminRecruitUpsertRequest(
    String position,
    String department,
    String empType,
    String careerLevel,
    String location,
    String deadline,
    String description,
    Integer isVisible
) {
}


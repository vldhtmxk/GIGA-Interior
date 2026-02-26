package com.demo.domain.recruit.dto.response;

import java.time.LocalDateTime;

import com.demo.domain.recruit.entity.Recruit;

public record AdminRecruitResponse(
    Long recruitId,
    String position,
    String department,
    String empType,
    String careerLevel,
    String location,
    LocalDateTime deadline,
    String description,
    String imageUrl,
    Integer isVisible,
    Integer hit,
    Integer applicantCount,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static AdminRecruitResponse from(Recruit recruit, int applicantCount) {
        return new AdminRecruitResponse(
            recruit.getRecruitId(),
            recruit.getPosition(),
            recruit.getDepartment(),
            recruit.getEmpType(),
            recruit.getCareer_level(),
            recruit.getLocation(),
            recruit.getDeadline(),
            recruit.getDescription(),
            recruit.getImageUrl(),
            recruit.getIsVisible(),
            recruit.getHit(),
            applicantCount,
            recruit.getCreatedAt(),
            recruit.getUpdatedAt()
        );
    }
}

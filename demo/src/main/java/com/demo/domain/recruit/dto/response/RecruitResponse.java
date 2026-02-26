package com.demo.domain.recruit.dto.response;

import java.time.LocalDateTime;

import com.demo.domain.recruit.entity.Recruit;

public record RecruitResponse(
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
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static RecruitResponse from(Recruit recruit) {
        return new RecruitResponse(
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
            recruit.getCreatedAt(),
            recruit.getUpdatedAt()
        );
    }
}

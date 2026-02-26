package com.demo.domain.company.dto.response;

import com.demo.domain.ceo.entity.CeoInfo;

public record CeoInfoResponse(
    Long ceoInfoId,
    String name,
    String title,
    String message,
    String image
) {
    public static CeoInfoResponse from(CeoInfo entity) {
        return new CeoInfoResponse(
            entity.getCeoInfoId(),
            entity.getName(),
            entity.getTitle(),
            entity.getMessage(),
            entity.getImage()
        );
    }
}

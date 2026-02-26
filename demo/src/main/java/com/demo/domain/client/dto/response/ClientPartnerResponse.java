package com.demo.domain.client.dto.response;

import java.time.LocalDateTime;

import com.demo.domain.client.entity.ClientPartner;

public record ClientPartnerResponse(
    Long clientId,
    String name,
    String category,
    String logoUrl,
    String description,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static ClientPartnerResponse from(ClientPartner entity) {
        return new ClientPartnerResponse(
            entity.getClientId(),
            entity.getName(),
            entity.getCategory() == null ? null : entity.getCategory().name(),
            entity.getLogoUrl(),
            entity.getDescription(),
            entity.getCreatedAt(),
            entity.getUpdatedAt()
        );
    }
}

package com.demo.domain.client.dto.request;

public record ClientPartnerUpsertRequest(
    String name,
    String category,
    String description
) {
}

package com.demo.domain.company.dto.request;

public record AdminCeoUpsertRequest(
    String name,
    String title,
    String message
) {
}

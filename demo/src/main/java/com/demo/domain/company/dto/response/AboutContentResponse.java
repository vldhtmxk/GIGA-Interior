package com.demo.domain.company.dto.response;

import java.util.List;

public record AboutContentResponse(
    CeoInfoResponse ceo,
    List<CompanyHistoryResponse> histories
) {
}

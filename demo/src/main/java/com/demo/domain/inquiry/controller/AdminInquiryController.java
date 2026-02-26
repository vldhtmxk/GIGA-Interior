package com.demo.domain.inquiry.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.demo.domain.admin.dto.response.AdminAuthResponse;
import com.demo.domain.admin.service.AdminAuthService;
import com.demo.domain.inquiry.dto.request.AdminInquiryReplyEmailRequest;
import com.demo.domain.inquiry.dto.request.AdminInquiryUpdateRequest;
import com.demo.domain.inquiry.dto.response.AdminInquiryDetailResponse;
import com.demo.domain.inquiry.dto.response.AdminInquiryListResponse;
import com.demo.domain.inquiry.dto.response.InquiryResponse;
import com.demo.domain.inquiry.service.InquiryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/inquiries")
public class AdminInquiryController {

    private final InquiryService inquiryService;
    private final AdminAuthService adminAuthService;

    @GetMapping
    public AdminInquiryListResponse getAll(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @RequestParam(name = "page", required = false) Integer page,
        @RequestParam(name = "size", required = false) Integer size,
        @RequestParam(name = "status", required = false) String status,
        @RequestParam(name = "q", required = false) String q,
        @RequestParam(name = "sort", required = false) String sort
    ) {
        adminAuthService.me(authorization);
        return inquiryService.getAdminList(page, size, status, q, sort);
    }

    @GetMapping("/{inquiryId}")
    public AdminInquiryDetailResponse getOne(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long inquiryId
    ) {
        adminAuthService.me(authorization);
        return inquiryService.getAdminDetail(inquiryId);
    }

    @PatchMapping("/{inquiryId}")
    public InquiryResponse update(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long inquiryId,
        @RequestBody AdminInquiryUpdateRequest request
    ) {
        AdminAuthResponse.AdminProfile admin = adminAuthService.me(authorization);
        return inquiryService.updateAdminFields(inquiryId, request, admin.name());
    }

    @PostMapping("/{inquiryId}/reply-email")
    public InquiryResponse sendReplyEmail(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long inquiryId,
        @RequestBody AdminInquiryReplyEmailRequest request
    ) {
        AdminAuthResponse.AdminProfile admin = adminAuthService.me(authorization);
        return inquiryService.sendReplyEmail(inquiryId, request, admin.name());
    }

    @GetMapping(value = "/export.csv", produces = "text/csv; charset=UTF-8")
    public ResponseEntity<String> exportCsv(@RequestHeader(name = "Authorization", required = false) String authorization) {
        adminAuthService.me(authorization);
        String header = "inquiryId,name,email,phone,projectType,budgetRange,status,repliedBy,repliedAt,createdAt,message,adminMemo";
        String rows = inquiryService.getAll().stream().map(this::toCsvRow).collect(Collectors.joining("\n"));
        String body = "\uFEFF" + header + (rows.isBlank() ? "" : "\n" + rows);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"inquiries.csv\"")
            .contentType(new MediaType("text", "csv"))
            .body(body);
    }

    private String toCsvRow(InquiryResponse r) {
        return String.join(",",
            csv(r.inquiryId()),
            csv(r.name()),
            csv(r.email()),
            csv(r.phone()),
            csv(r.projectType()),
            csv(r.budgetRange()),
            csv(r.status()),
            csv(r.repliedBy()),
            csv(r.repliedAt()),
            csv(r.createdAt()),
            csv(r.message()),
            csv(r.adminMemo())
        );
    }

    private String csv(Object value) {
        String s = value == null ? "" : String.valueOf(value);
        return "\"" + s.replace("\"", "\"\"").replace("\r", " ").replace("\n", " ") + "\"";
    }
}

package com.demo.domain.applicant.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.multipart.MultipartFile;

import com.demo.domain.admin.service.AdminAuthService;
import com.demo.domain.applicant.dto.request.AdminApplicantUpdateRequest;
import com.demo.domain.applicant.dto.request.ApplicantCreateRequest;
import com.demo.domain.applicant.dto.response.ApplicantResponse;
import com.demo.domain.applicant.service.ApplicantService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ApplicantController {

    private final ApplicantService applicantService;
    private final AdminAuthService adminAuthService;

    @PostMapping("/api/recruits/{recruitId}/applicants")
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicantResponse create(
        @PathVariable Long recruitId,
        @RequestParam String name,
        @RequestParam String email,
        @RequestParam String phone,
        @RequestParam String experience,
        @RequestParam String education,
        @RequestParam(required = false) String portfolio,
        @RequestParam String motivation,
        @RequestParam(required = false) String salary,
        @RequestParam(required = false) String startDate,
        @RequestParam(name = "files", required = false) List<MultipartFile> files
    ) {
        ApplicantCreateRequest request = new ApplicantCreateRequest(
            name, email, phone, experience, education, portfolio, motivation, salary, startDate
        );
        return applicantService.create(recruitId, request, files);
    }

    @GetMapping("/api/admin/recruits/{recruitId}/applicants")
    public List<ApplicantResponse> getByRecruit(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long recruitId
    ) {
        adminAuthService.me(authorization);
        return applicantService.getByRecruitId(recruitId);
    }

    @GetMapping("/api/admin/applicants/{applicantId}")
    public ApplicantResponse getOne(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long applicantId
    ) {
        adminAuthService.me(authorization);
        return applicantService.getOne(applicantId);
    }

    @PatchMapping("/api/admin/applicants/{applicantId}")
    public ApplicantResponse update(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long applicantId,
        @RequestBody AdminApplicantUpdateRequest request
    ) {
        adminAuthService.me(authorization);
        return applicantService.updateAdmin(applicantId, request);
    }
}

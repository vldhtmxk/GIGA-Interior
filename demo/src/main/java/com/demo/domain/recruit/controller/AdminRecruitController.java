package com.demo.domain.recruit.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.demo.domain.admin.service.AdminAuthService;
import com.demo.domain.recruit.dto.request.AdminRecruitUpsertRequest;
import com.demo.domain.recruit.dto.response.AdminRecruitResponse;
import com.demo.domain.recruit.service.AdminRecruitService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/recruits")
public class AdminRecruitController {

    private final AdminRecruitService adminRecruitService;
    private final AdminAuthService adminAuthService;

    @GetMapping
    public List<AdminRecruitResponse> getAll(@RequestHeader(name = "Authorization", required = false) String authorization) {
        adminAuthService.me(authorization);
        return adminRecruitService.getAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AdminRecruitResponse create(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @RequestBody AdminRecruitUpsertRequest request
    ) {
        adminAuthService.me(authorization);
        return adminRecruitService.create(request);
    }

    @PutMapping("/{recruitId}")
    public AdminRecruitResponse update(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long recruitId,
        @RequestBody AdminRecruitUpsertRequest request
    ) {
        adminAuthService.me(authorization);
        return adminRecruitService.update(recruitId, request);
    }

    @DeleteMapping("/{recruitId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long recruitId
    ) {
        adminAuthService.me(authorization);
        adminRecruitService.delete(recruitId);
    }

    @PostMapping("/{recruitId}/image")
    public AdminRecruitResponse uploadImage(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long recruitId,
        @RequestParam("image") MultipartFile image
    ) {
        adminAuthService.me(authorization);
        return adminRecruitService.uploadImage(recruitId, image);
    }
}

package com.demo.domain.company.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.demo.domain.admin.service.AdminAuthService;
import com.demo.domain.company.dto.request.AdminCeoUpsertRequest;
import com.demo.domain.company.dto.request.CompanyHistoryUpsertRequest;
import com.demo.domain.company.dto.response.AboutContentResponse;
import com.demo.domain.company.dto.response.CeoInfoResponse;
import com.demo.domain.company.dto.response.CompanyHistoryResponse;
import com.demo.domain.company.service.AboutContentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/about")
public class AdminAboutContentController {

    private final AboutContentService aboutContentService;
    private final AdminAuthService adminAuthService;

    @GetMapping
    public AboutContentResponse getAboutContent(@RequestHeader(name = "Authorization", required = false) String authorization) {
        adminAuthService.me(authorization);
        return aboutContentService.getAboutContent();
    }

    @PutMapping("/ceo")
    public CeoInfoResponse updateCeo(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @RequestBody AdminCeoUpsertRequest request
    ) {
        adminAuthService.me(authorization);
        return aboutContentService.saveCeo(request);
    }

    @PostMapping("/ceo/image")
    public CeoInfoResponse uploadCeoImage(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @RequestParam("image") MultipartFile image
    ) {
        adminAuthService.me(authorization);
        return aboutContentService.uploadCeoImage(image);
    }

    @PostMapping("/histories")
    @ResponseStatus(HttpStatus.CREATED)
    public CompanyHistoryResponse createHistory(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @RequestBody CompanyHistoryUpsertRequest request
    ) {
        adminAuthService.me(authorization);
        return aboutContentService.createHistory(request);
    }

    @PutMapping("/histories/{historyId}")
    public CompanyHistoryResponse updateHistory(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long historyId,
        @RequestBody CompanyHistoryUpsertRequest request
    ) {
        adminAuthService.me(authorization);
        return aboutContentService.updateHistory(historyId, request);
    }

    @DeleteMapping("/histories/{historyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteHistory(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long historyId
    ) {
        adminAuthService.me(authorization);
        aboutContentService.deleteHistory(historyId);
    }
}

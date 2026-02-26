package com.demo.domain.client.controller;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.demo.domain.admin.service.AdminAuthService;
import com.demo.domain.client.dto.request.ClientPartnerUpsertRequest;
import com.demo.domain.client.dto.response.ClientPartnerResponse;
import com.demo.domain.client.service.ClientPartnerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/clients")
public class AdminClientPartnerController {

    private final ClientPartnerService clientPartnerService;
    private final AdminAuthService adminAuthService;

    @GetMapping
    public List<ClientPartnerResponse> getAll(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @RequestParam(name = "category", required = false) String category
    ) {
        adminAuthService.me(authorization);
        return clientPartnerService.getAll(category);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ClientPartnerResponse create(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @RequestBody ClientPartnerUpsertRequest request
    ) {
        adminAuthService.me(authorization);
        return clientPartnerService.create(request);
    }

    @PutMapping("/{clientId}")
    public ClientPartnerResponse update(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long clientId,
        @RequestBody ClientPartnerUpsertRequest request
    ) {
        adminAuthService.me(authorization);
        return clientPartnerService.update(clientId, request);
    }

    @DeleteMapping("/{clientId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long clientId
    ) {
        adminAuthService.me(authorization);
        clientPartnerService.delete(clientId);
    }

    @PostMapping("/{clientId}/logo")
    public ClientPartnerResponse uploadLogo(
        @RequestHeader(name = "Authorization", required = false) String authorization,
        @PathVariable Long clientId,
        @RequestParam("logo") MultipartFile logo
    ) {
        adminAuthService.me(authorization);
        return clientPartnerService.uploadLogo(clientId, logo);
    }
}

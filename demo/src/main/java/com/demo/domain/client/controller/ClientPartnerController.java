package com.demo.domain.client.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.demo.domain.client.dto.response.ClientPartnerResponse;
import com.demo.domain.client.service.ClientPartnerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/clients")
public class ClientPartnerController {

    private final ClientPartnerService clientPartnerService;

    @GetMapping
    public List<ClientPartnerResponse> getAll(@RequestParam(name = "category", required = false) String category) {
        return clientPartnerService.getAll(category);
    }
}

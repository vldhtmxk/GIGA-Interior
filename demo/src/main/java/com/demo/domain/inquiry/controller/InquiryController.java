package com.demo.domain.inquiry.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.demo.domain.inquiry.dto.request.InquiryCreateRequest;
import com.demo.domain.inquiry.dto.response.InquiryResponse;
import com.demo.domain.inquiry.service.InquiryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inquiries")
public class InquiryController {

    private final InquiryService inquiryService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InquiryResponse create(@RequestBody InquiryCreateRequest request) {
        return inquiryService.create(request);
    }
}


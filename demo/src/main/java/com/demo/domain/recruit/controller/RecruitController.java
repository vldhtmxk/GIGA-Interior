package com.demo.domain.recruit.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.demo.domain.recruit.dto.response.RecruitResponse;
import com.demo.domain.recruit.service.RecruitQueryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/recruits")
public class RecruitController {

    private final RecruitQueryService recruitQueryService;

    @GetMapping
    public List<RecruitResponse> getAllVisible() {
        return recruitQueryService.getVisibleRecruits();
    }

    @GetMapping("/{recruitId}")
    public RecruitResponse getOneVisible(@PathVariable Long recruitId) {
        return recruitQueryService.getVisibleRecruit(recruitId);
    }
}


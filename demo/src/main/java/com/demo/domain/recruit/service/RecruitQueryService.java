package com.demo.domain.recruit.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.demo.domain.recruit.dto.response.RecruitResponse;
import com.demo.domain.recruit.entity.Recruit;
import com.demo.domain.recruit.repository.RecruitRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RecruitQueryService {

    private final RecruitRepository recruitRepository;

    public List<RecruitResponse> getVisibleRecruits() {
        return recruitRepository.findByIsVisibleOrderByCreatedAtDesc(1)
            .stream()
            .map(RecruitResponse::from)
            .toList();
    }

    public RecruitResponse getVisibleRecruit(Long recruitId) {
        Recruit recruit = recruitRepository.findById(recruitId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "채용공고를 찾을 수 없습니다."));

        if (recruit.getIsVisible() != 1) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "채용공고를 찾을 수 없습니다.");
        }

        return RecruitResponse.from(recruit);
    }
}


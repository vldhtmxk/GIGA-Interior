package com.demo.domain.recruit.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;

import com.demo.domain.applicant.entity.Applicant;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;

import com.demo.domain.recruit.dto.request.AdminRecruitUpsertRequest;
import com.demo.domain.recruit.dto.response.AdminRecruitResponse;
import com.demo.domain.recruit.entity.Recruit;
import com.demo.domain.recruit.repository.RecruitRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminRecruitService {

    private final RecruitRepository recruitRepository;
    private final RecruitImageStorageService recruitImageStorageService;

    @Transactional(readOnly = true)
    public List<AdminRecruitResponse> getAll() {
        return recruitRepository.findAll().stream()
            // Recent applicant activity first so newly submitted applications bubble the posting to the top.
            .sorted(
                Comparator
                    .comparing(this::lastApplicantCreatedAt, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(Recruit::getUpdatedAt, Comparator.nullsLast(Comparator.reverseOrder()))
                    .thenComparing(Recruit::getRecruitId, Comparator.reverseOrder())
            )
            .map(this::toAdminResponse)
            .toList();
    }

    private LocalDateTime lastApplicantCreatedAt(Recruit recruit) {
        if (recruit.getApplicants() == null || recruit.getApplicants().isEmpty()) {
            return null;
        }
        return recruit.getApplicants().stream()
            .map(Applicant::getCreatedAt)
            .filter(java.util.Objects::nonNull)
            .max(LocalDateTime::compareTo)
            .orElse(null);
    }

    public AdminRecruitResponse create(AdminRecruitUpsertRequest request) {
        validate(request);

        Recruit recruit = new Recruit();
        apply(recruit, request);
        recruit.setHit(0);
        if (recruit.getIsVisible() == 0 && request.isVisible() == null) {
            recruit.setIsVisible(1);
        }
        return toAdminResponse(recruitRepository.save(recruit));
    }

    public AdminRecruitResponse update(Long recruitId, AdminRecruitUpsertRequest request) {
        validate(request);
        Recruit recruit = findRecruit(recruitId);
        apply(recruit, request);
        return toAdminResponse(recruitRepository.save(recruit));
    }

    public void delete(Long recruitId) {
        Recruit recruit = findRecruit(recruitId);
        recruitRepository.delete(recruit);
    }

    public AdminRecruitResponse uploadImage(Long recruitId, MultipartFile imageFile) {
        Recruit recruit = findRecruit(recruitId);
        String imageUrl = recruitImageStorageService.saveRecruitImage(imageFile, recruitId);
        recruit.setImageUrl(imageUrl);
        return toAdminResponse(recruitRepository.save(recruit));
    }

    private AdminRecruitResponse toAdminResponse(Recruit recruit) {
        int applicantCount = recruit.getApplicants() == null ? 0 : recruit.getApplicants().size();
        return AdminRecruitResponse.from(recruit, applicantCount);
    }

    private Recruit findRecruit(Long recruitId) {
        return recruitRepository.findById(recruitId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "채용공고를 찾을 수 없습니다."));
    }

    private void apply(Recruit recruit, AdminRecruitUpsertRequest request) {
        recruit.setPosition(request.position().trim());
        recruit.setDepartment(blankToNull(request.department()));
        recruit.setEmpType(blankToNull(request.empType()));
        recruit.setCareer_level(blankToNull(request.careerLevel()));
        recruit.setLocation(blankToNull(request.location()));
        recruit.setDeadline(parseDeadline(request.deadline()));
        recruit.setDescription(blankToNull(request.description()));
        recruit.setIsVisible(request.isVisible() == null ? 1 : (request.isVisible() == 0 ? 0 : 1));
    }

    private void validate(AdminRecruitUpsertRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청 본문이 비어 있습니다.");
        }
        if (isBlank(request.position()) || request.position().trim().length() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "직책명을 2자 이상 입력해주세요.");
        }
    }

    private LocalDateTime parseDeadline(String value) {
        if (isBlank(value)) {
            return null;
        }
        String trimmed = value.trim();
        try {
            if (trimmed.length() <= 10) {
                return LocalDate.parse(trimmed).atTime(23, 59, 59);
            }
            return LocalDateTime.parse(trimmed);
        } catch (DateTimeParseException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "마감일 형식이 올바르지 않습니다. (YYYY-MM-DD)");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }
}

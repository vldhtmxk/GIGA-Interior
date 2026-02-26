package com.demo.domain.applicant.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.demo.domain.applicant.dto.request.AdminApplicantUpdateRequest;
import com.demo.domain.applicant.dto.request.ApplicantCreateRequest;
import com.demo.domain.applicant.dto.response.ApplicantResponse;
import com.demo.domain.applicant.entity.Applicant;
import com.demo.domain.applicant.entity.ApplicantFile;
import com.demo.domain.applicant.repository.ApplicantRepository;
import com.demo.domain.recruit.entity.Recruit;
import com.demo.domain.recruit.repository.RecruitRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicantService {

    private static final Set<String> ALLOWED_STATUS = Set.of("pending", "reviewed", "interview", "rejected", "hired");

    private final ApplicantRepository applicantRepository;
    private final RecruitRepository recruitRepository;
    private final ApplicantFileStorageService applicantFileStorageService;

    public ApplicantResponse create(Long recruitId, ApplicantCreateRequest request, List<MultipartFile> files) {
        validateCreateRequest(request);

        Recruit recruit = recruitRepository.findById(recruitId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "채용공고를 찾을 수 없습니다."));

        Applicant applicant = new Applicant();
        applicant.setRecruit(recruit);
        applicant.setName(request.name().trim());
        applicant.setEmail(request.email().trim());
        applicant.setPhone(request.phone().trim());
        applicant.setStatus("pending");
        applicant.setCareer_summary(request.experience().trim());
        applicant.setEducation(request.education().trim());
        applicant.setCoverLetter(blankToNull(request.portfolio()));
        applicant.setMovication(request.motivation().trim());
        applicant.setDesireSalary(blankToNull(request.salary()));
        applicant.setAvailableDate(parseDate(request.startDate()));
        applicant.setAdminComment(null);

        Applicant saved = applicantRepository.save(applicant);

        List<ApplicantFile> savedFiles = applicantFileStorageService.saveApplicantFiles(saved, files);
        if (!savedFiles.isEmpty()) {
            saved.getApplicantFiles().addAll(savedFiles);
            saved = applicantRepository.save(saved);
        }

        return ApplicantResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicantResponse> getByRecruitId(Long recruitId) {
        if (!recruitRepository.existsById(recruitId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "채용공고를 찾을 수 없습니다.");
        }
        return applicantRepository.findByRecruit_RecruitIdOrderByApplicantIdDesc(recruitId)
            .stream()
            .map(ApplicantResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public ApplicantResponse getOne(Long applicantId) {
        return ApplicantResponse.from(findApplicant(applicantId));
    }

    public ApplicantResponse updateAdmin(Long applicantId, AdminApplicantUpdateRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청 본문이 비어 있습니다.");
        }
        Applicant applicant = findApplicant(applicantId);

        if (request.status() != null) {
            String normalized = request.status().trim().toLowerCase();
            if (!ALLOWED_STATUS.contains(normalized)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않는 지원자 상태입니다.");
            }
            applicant.setStatus(normalized);
        }
        if (request.adminComment() != null) {
            applicant.setAdminComment(blankToNull(request.adminComment()));
        }

        return ApplicantResponse.from(applicantRepository.save(applicant));
    }

    private Applicant findApplicant(Long applicantId) {
        return applicantRepository.findById(applicantId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "지원자를 찾을 수 없습니다."));
    }

    private void validateCreateRequest(ApplicantCreateRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청 본문이 비어 있습니다.");
        }
        if (isBlank(request.name()) || request.name().trim().length() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이름을 2자 이상 입력해주세요.");
        }
        if (isBlank(request.email()) || !request.email().contains("@")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효한 이메일을 입력해주세요.");
        }
        if (isBlank(request.phone()) || request.phone().replaceAll("\\D", "").length() < 9) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "유효한 연락처를 입력해주세요.");
        }
        if (isBlank(request.experience())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "경력 사항을 입력해주세요.");
        }
        if (isBlank(request.education())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "학력 사항을 입력해주세요.");
        }
        if (isBlank(request.motivation()) || request.motivation().trim().length() < 5) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원 동기를 입력해주세요.");
        }
    }

    private LocalDateTime parseDate(String value) {
        if (isBlank(value)) return null;
        try {
            return LocalDate.parse(value.trim()).atStartOfDay();
        } catch (DateTimeParseException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "입사 가능일 형식이 올바르지 않습니다.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }
}


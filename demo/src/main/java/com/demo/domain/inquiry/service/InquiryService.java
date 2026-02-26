package com.demo.domain.inquiry.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.demo.domain.inquiry.dto.request.AdminInquiryUpdateRequest;
import com.demo.domain.inquiry.dto.request.AdminInquiryReplyEmailRequest;
import com.demo.domain.inquiry.dto.request.InquiryCreateRequest;
import com.demo.domain.inquiry.dto.response.AdminInquiryDetailResponse;
import com.demo.domain.inquiry.dto.response.AdminInquiryListResponse;
import com.demo.domain.inquiry.dto.response.InquiryMemoHistoryResponse;
import com.demo.domain.inquiry.dto.response.InquiryResponse;
import com.demo.domain.inquiry.entity.Inquiry;
import com.demo.domain.inquiry.entity.InquiryMemoHistory;
import com.demo.domain.inquiry.enums.InquiryStatus;
import com.demo.domain.inquiry.notification.InquiryNotificationService;
import com.demo.domain.inquiry.repository.InquiryMemoHistoryRepository;
import com.demo.domain.inquiry.repository.InquiryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class InquiryService {
    private final InquiryRepository inquiryRepository;
    private final InquiryMemoHistoryRepository inquiryMemoHistoryRepository;
    private final InquiryNotificationService inquiryNotificationService;

    public InquiryResponse create(InquiryCreateRequest request) {
        validate(request);

        Inquiry inquiry = Inquiry.builder()
            .name(request.name().trim())
            .email(blankToNull(request.email()))
            .phone(blankToNull(request.phone()))
            .projectType(blankToNull(request.projectType()))
            .budgetRange(blankToNull(request.budgetRange()))
            .message(blankToNull(request.message()))
            .status(InquiryStatus.NEW)
            .build();

        Inquiry saved = inquiryRepository.save(inquiry);
        inquiryNotificationService.notifyInquiryCreated(saved);
        return InquiryResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<InquiryResponse> getAll() {
        return inquiryRepository.findAll(Sort.by(Sort.Direction.DESC, "inquiryId"))
            .stream().map(InquiryResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public AdminInquiryListResponse getAdminList(
        Integer page,
        Integer size,
        String status,
        String query,
        String sort
    ) {
        int pageNo = page == null ? 1 : Math.max(1, page);
        int pageSize = size == null ? 10 : Math.min(Math.max(1, size), 100);
        Sort pageSort = resolveSort(sort);

        Specification<Inquiry> spec = Specification.where(statusSpec(status)).and(querySpec(query));
        Pageable pageable = PageRequest.of(pageNo - 1, pageSize, pageSort);
        Page<Inquiry> result = inquiryRepository.findAll(spec, pageable);

        Map<String, Long> statusCounts = new LinkedHashMap<>();
        statusCounts.put("ALL", inquiryRepository.count());
        statusCounts.put("NEW", inquiryRepository.countByStatus(InquiryStatus.NEW));
        statusCounts.put("IN_PROGRESS", inquiryRepository.countByStatus(InquiryStatus.IN_PROGRESS));
        statusCounts.put("HOLD", inquiryRepository.countByStatus(InquiryStatus.HOLD));
        statusCounts.put("DONE", inquiryRepository.countByStatus(InquiryStatus.DONE));

        return new AdminInquiryListResponse(
            result.getContent().stream().map(InquiryResponse::from).toList(),
            pageNo,
            pageSize,
            result.getTotalElements(),
            result.getTotalPages(),
            statusCounts
        );
    }

    @Transactional(readOnly = true)
    public InquiryResponse getById(Long inquiryId) {
        return InquiryResponse.from(findInquiry(inquiryId));
    }

    @Transactional(readOnly = true)
    public AdminInquiryDetailResponse getAdminDetail(Long inquiryId) {
        Inquiry inquiry = findInquiry(inquiryId);
        List<InquiryMemoHistoryResponse> histories = inquiryMemoHistoryRepository
            .findByInquiry_InquiryIdOrderByMemoHistoryIdDesc(inquiryId)
            .stream()
            .map(InquiryMemoHistoryResponse::from)
            .toList();
        Long previousInquiryId = inquiryRepository.findTopByInquiryIdLessThanOrderByInquiryIdDesc(inquiryId)
            .map(Inquiry::getInquiryId)
            .orElse(null);
        Long nextInquiryId = inquiryRepository.findTopByInquiryIdGreaterThanOrderByInquiryIdAsc(inquiryId)
            .map(Inquiry::getInquiryId)
            .orElse(null);

        return new AdminInquiryDetailResponse(InquiryResponse.from(inquiry), histories, previousInquiryId, nextInquiryId);
    }

    public InquiryResponse updateAdminFields(Long inquiryId, AdminInquiryUpdateRequest request, String actorName) {
        Inquiry inquiry = findInquiry(inquiryId);
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청 본문이 비어 있습니다.");
        }
        if (isBlank(actorName)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "관리자 인증이 필요합니다.");
        }

        if (request.status() != null) {
            String normalized = request.status().trim().toUpperCase();
            InquiryStatus nextStatus;
            try {
                nextStatus = InquiryStatus.valueOf(normalized);
            } catch (IllegalArgumentException ex) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않는 문의 상태입니다.");
            }
            inquiry.setStatus(nextStatus);
            if (InquiryStatus.DONE.equals(nextStatus) && inquiry.getRepliedAt() == null) {
                inquiry.setRepliedAt(LocalDateTime.now());
                inquiry.setRepliedBy(actorName);
            }
        }

        if (request.adminMemo() != null) {
            String previousMemo = inquiry.getAdminMemo();
            String nextMemo = blankToNull(request.adminMemo());
            if (!equalsNullable(previousMemo, nextMemo)) {
                inquiry.setAdminMemo(nextMemo);
                inquiryMemoHistoryRepository.save(
                    InquiryMemoHistory.builder()
                        .inquiry(inquiry)
                        .adminName(actorName)
                        .previousMemo(previousMemo)
                        .nextMemo(nextMemo)
                        .build()
                );
            }
        }

        Inquiry saved = inquiryRepository.save(inquiry);
        inquiryNotificationService.notifyInquiryUpdated(saved);
        return InquiryResponse.from(saved);
    }

    public InquiryResponse sendReplyEmail(Long inquiryId, AdminInquiryReplyEmailRequest request, String actorName) {
        Inquiry inquiry = findInquiry(inquiryId);
        if (request == null || isBlank(request.subject()) || isBlank(request.body())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "메일 제목과 내용을 입력해주세요.");
        }
        if (isBlank(actorName)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "관리자 인증이 필요합니다.");
        }

        inquiryNotificationService.sendReplyEmailToCustomer(
            inquiry,
            request.subject().trim(),
            request.body().trim()
        );

        if (Boolean.TRUE.equals(request.markDone())) {
            inquiry.setStatus(InquiryStatus.DONE);
            if (inquiry.getRepliedAt() == null) {
                inquiry.setRepliedAt(LocalDateTime.now());
            }
            inquiry.setRepliedBy(actorName);
        }

        return InquiryResponse.from(inquiryRepository.save(inquiry));
    }

    private void validate(InquiryCreateRequest request) {
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
        if (isBlank(request.projectType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "프로젝트 유형을 선택해주세요.");
        }
        if (isBlank(request.budgetRange())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "예산 범위를 선택해주세요.");
        }
        if (isBlank(request.message()) || request.message().trim().length() < 10) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "문의 내용을 10자 이상 입력해주세요.");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }

    private boolean equalsNullable(String a, String b) {
        if (a == null) return b == null;
        return a.equals(b);
    }

    private Inquiry findInquiry(Long inquiryId) {
        return inquiryRepository.findById(inquiryId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "문의 내역을 찾을 수 없습니다."));
    }

    private Sort resolveSort(String sort) {
        if ("oldest".equalsIgnoreCase(sort)) {
            return Sort.by(Sort.Direction.ASC, "createdAt");
        }
        return Sort.by(Sort.Direction.DESC, "createdAt");
    }

    private Specification<Inquiry> statusSpec(String status) {
        if (isBlank(status) || "ALL".equalsIgnoreCase(status)) {
            return null;
        }
        InquiryStatus inquiryStatus;
        try {
            inquiryStatus = InquiryStatus.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않는 문의 상태입니다.");
        }
        return (root, query, cb) -> cb.equal(root.get("status"), inquiryStatus);
    }

    private Specification<Inquiry> querySpec(String query) {
        if (isBlank(query)) {
            return null;
        }
        String like = "%" + query.trim().toLowerCase() + "%";
        return (root, q, cb) -> cb.or(
            cb.like(cb.lower(root.get("name")), like),
            cb.like(cb.lower(cb.coalesce(root.get("email"), "")), like),
            cb.like(cb.lower(cb.coalesce(root.get("phone"), "")), like),
            cb.like(cb.lower(cb.coalesce(root.get("projectType"), "")), like),
            cb.like(cb.lower(cb.coalesce(root.get("budgetRange"), "")), like),
            cb.like(cb.lower(cb.coalesce(root.get("message"), "")), like),
            cb.like(cb.lower(cb.coalesce(root.get("adminMemo"), "")), like)
        );
    }
}

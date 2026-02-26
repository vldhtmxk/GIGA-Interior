package com.demo.domain.company.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.demo.domain.ceo.entity.CeoInfo;
import com.demo.domain.ceo.repository.CeoInfoRepository;
import com.demo.domain.company.dto.request.AdminCeoUpsertRequest;
import com.demo.domain.company.dto.request.CompanyHistoryUpsertRequest;
import com.demo.domain.company.dto.response.AboutContentResponse;
import com.demo.domain.company.dto.response.CeoInfoResponse;
import com.demo.domain.company.dto.response.CompanyHistoryResponse;
import com.demo.domain.company.entity.CompanyHistory;
import com.demo.domain.company.repository.CompanyHistoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AboutContentService {

    private final CeoInfoRepository ceoInfoRepository;
    private final CompanyHistoryRepository companyHistoryRepository;
    private final CeoImageStorageService ceoImageStorageService;

    @Transactional(readOnly = true)
    public AboutContentResponse getAboutContent() {
        CeoInfoResponse ceo = ceoInfoRepository.findTopByOrderByCeoInfoIdAsc()
            .map(CeoInfoResponse::from)
            .orElse(null);
        return new AboutContentResponse(ceo, getHistories());
    }

    public CeoInfoResponse saveCeo(AdminCeoUpsertRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청 본문이 비어 있습니다.");
        }
        if (isBlank(request.name())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CEO 이름을 입력해주세요.");
        }
        if (isBlank(request.title())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CEO 직책을 입력해주세요.");
        }
        if (isBlank(request.message())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CEO 메시지를 입력해주세요.");
        }

        CeoInfo ceo = getOrCreateDefaultCeo();
        ceo.setName(request.name().trim());
        ceo.setTitle(request.title().trim());
        ceo.setMessage(request.message().trim());
        ceo = ceoInfoRepository.save(ceo);
        return CeoInfoResponse.from(ceo);
    }

    public CeoInfoResponse uploadCeoImage(MultipartFile image) {
        CeoInfo ceo = getOrCreateDefaultCeo();
        ceo = ceoInfoRepository.save(ceo);
        String previous = ceo.getImage();
        String imageUrl = ceoImageStorageService.save(image, ceo.getCeoInfoId());
        ceo.setImage(imageUrl);
        ceo = ceoInfoRepository.save(ceo);
        if (previous != null && !previous.equals(imageUrl)) {
            ceoImageStorageService.deleteFile(previous);
        }
        return CeoInfoResponse.from(ceo);
    }

    public CompanyHistoryResponse createHistory(CompanyHistoryUpsertRequest request) {
        validateHistory(request);
        CompanyHistory history = new CompanyHistory();
        applyHistory(history, request);
        return CompanyHistoryResponse.from(companyHistoryRepository.save(history));
    }

    public CompanyHistoryResponse updateHistory(Long historyId, CompanyHistoryUpsertRequest request) {
        validateHistory(request);
        CompanyHistory history = companyHistoryRepository.findById(historyId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회사 연혁을 찾을 수 없습니다."));
        applyHistory(history, request);
        return CompanyHistoryResponse.from(companyHistoryRepository.save(history));
    }

    public void deleteHistory(Long historyId) {
        CompanyHistory history = companyHistoryRepository.findById(historyId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "회사 연혁을 찾을 수 없습니다."));
        companyHistoryRepository.delete(history);
    }

    @Transactional(readOnly = true)
    public List<CompanyHistoryResponse> getHistories() {
        return companyHistoryRepository.findAll().stream()
            .sorted((a, b) -> {
                int byYear = Integer.compare(b.getYear(), a.getYear());
                if (byYear != 0) return byYear;
                long aId = a.getHistoryId() == null ? 0L : a.getHistoryId();
                long bId = b.getHistoryId() == null ? 0L : b.getHistoryId();
                return Long.compare(bId, aId);
            })
            .map(CompanyHistoryResponse::from)
            .toList();
    }

    private CeoInfo getOrCreateDefaultCeo() {
        return ceoInfoRepository.findTopByOrderByCeoInfoIdAsc()
            .orElseGet(() -> {
                CeoInfo ceo = new CeoInfo();
                ceo.setName("대표");
                ceo.setTitle("대표");
                ceo.setMessage("CEO 메시지를 입력해주세요.");
                return ceoInfoRepository.save(ceo);
            });
    }

    private CeoInfoResponse toCeoResponse(CeoInfo ceo) {
        return CeoInfoResponse.from(ceo);
    }

    private void validateHistory(CompanyHistoryUpsertRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청 본문이 비어 있습니다.");
        }
        if (request.year() == null || request.year() < 1900 || request.year() > 3000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "연도 값을 확인해주세요.");
        }
        if (isBlank(request.title())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "연혁 제목을 입력해주세요.");
        }
    }

    private void applyHistory(CompanyHistory history, CompanyHistoryUpsertRequest request) {
        history.setYear(request.year());
        history.setTitle(request.title().trim());
        history.setDescription(isBlank(request.description()) ? null : request.description().trim());
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}

package com.demo.domain.portfolio.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.demo.domain.portfolio.dto.request.PortfolioUpsertRequest;
import com.demo.domain.portfolio.dto.response.PortfolioResponse;
import com.demo.domain.portfolio.entity.Portfolio;
import com.demo.domain.portfolio.entity.PortfolioImage;
import com.demo.domain.portfolio.repository.PortfolioImageRepository;
import com.demo.domain.portfolio.repository.PortfolioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final PortfolioImageRepository portfolioImageRepository;
    private final PortfolioImageStorageService portfolioImageStorageService;

    @Transactional(readOnly = true)
    public List<PortfolioResponse> getAll() {
        return portfolioRepository.findAll().stream()
            .sorted((a, b) -> Long.compare(b.getPortfolioId(), a.getPortfolioId()))
            .map(PortfolioResponse::from)
            .toList();
    }

    @Transactional(readOnly = true)
    public PortfolioResponse getOne(Long portfolioId) {
        return PortfolioResponse.from(findPortfolio(portfolioId));
    }

    public PortfolioResponse create(PortfolioUpsertRequest request) {
        validate(request);
        Portfolio portfolio = new Portfolio();
        apply(portfolio, request);
        return PortfolioResponse.from(portfolioRepository.save(portfolio));
    }

    public PortfolioResponse update(Long portfolioId, PortfolioUpsertRequest request) {
        validate(request);
        Portfolio portfolio = findPortfolio(portfolioId);
        apply(portfolio, request);
        return PortfolioResponse.from(portfolioRepository.save(portfolio));
    }

    public void delete(Long portfolioId) {
        portfolioRepository.delete(findPortfolio(portfolioId));
    }

    public PortfolioResponse uploadImages(Long portfolioId, List<MultipartFile> images) {
        Portfolio portfolio = findPortfolio(portfolioId);
        int startOrder = portfolio.getPortfolioImages() == null ? 0 : portfolio.getPortfolioImages().size();
        List<PortfolioImage> saved = portfolioImageStorageService.saveImages(portfolio, images, startOrder);
        if (!saved.isEmpty()) {
            portfolio.getPortfolioImages().addAll(saved);
            portfolioImageRepository.saveAll(saved);
            portfolio = portfolioRepository.save(portfolio);
        }
        return PortfolioResponse.from(portfolio);
    }

    public PortfolioResponse deleteImage(Long portfolioId, Long portfolioImageId) {
        Portfolio portfolio = findPortfolio(portfolioId);
        PortfolioImage image = portfolioImageRepository
            .findByPortfolioImageIdAndPortfolio_PortfolioId(portfolioImageId, portfolioId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "포트폴리오 이미지를 찾을 수 없습니다."));

        portfolioImageStorageService.deleteImageFile(image.getImageUrl());
        portfolio.getPortfolioImages().removeIf(item -> item.getPortfolioImageId() == image.getPortfolioImageId());
        portfolio = portfolioRepository.save(portfolio);
        return PortfolioResponse.from(portfolio);
    }

    private Portfolio findPortfolio(Long portfolioId) {
        return portfolioRepository.findById(portfolioId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "포트폴리오를 찾을 수 없습니다."));
    }

    private void validate(PortfolioUpsertRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청 본문이 비어 있습니다.");
        }
        if (isBlank(request.title()) || request.title().trim().length() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "프로젝트 제목을 2자 이상 입력해주세요.");
        }
    }

    private void apply(Portfolio portfolio, PortfolioUpsertRequest request) {
        portfolio.setTitle(request.title().trim());
        portfolio.setCategory(blankToNull(request.category()));
        portfolio.setLocation(blankToNull(request.location()));
        portfolio.setYear(request.year() == null ? 0 : request.year());
        portfolio.setCliient(blankToNull(request.clientName()));
        portfolio.setArea(blankToNull(request.area()));
        portfolio.setPeriod(parseDuration(request.duration()));
        portfolio.setDescription(blankToNull(request.description()));
        portfolio.setConcept(blankToNull(request.concept()));
        portfolio.setFeature(blankToNull(request.feature()));
        portfolio.setMaterials(blankToNull(request.materials()));
    }

    private int parseDuration(String duration) {
        if (isBlank(duration)) return 0;
        String digits = duration.replaceAll("\\D", "");
        if (digits.isBlank()) return 0;
        try {
            return Integer.parseInt(digits);
        } catch (NumberFormatException ex) {
            return 0;
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }
}

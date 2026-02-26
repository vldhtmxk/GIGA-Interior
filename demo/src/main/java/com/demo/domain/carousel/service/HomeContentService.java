package com.demo.domain.carousel.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.demo.domain.carousel.dto.request.HomeFeaturedProjectsUpdateRequest;
import com.demo.domain.carousel.dto.request.MainCarouselUpsertRequest;
import com.demo.domain.carousel.dto.response.HomeContentResponse;
import com.demo.domain.carousel.dto.response.HomeFeaturedProjectResponse;
import com.demo.domain.carousel.dto.response.MainCarouselResponse;
import com.demo.domain.carousel.entity.HomeFeaturedPortfolio;
import com.demo.domain.carousel.entity.MainCarousel;
import com.demo.domain.carousel.repository.HomeFeaturedPortfolioRepository;
import com.demo.domain.carousel.repository.MainCarouselRepository;
import com.demo.domain.portfolio.entity.Portfolio;
import com.demo.domain.portfolio.repository.PortfolioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class HomeContentService {

    private final MainCarouselRepository mainCarouselRepository;
    private final HomeFeaturedPortfolioRepository homeFeaturedPortfolioRepository;
    private final PortfolioRepository portfolioRepository;
    private final CarouselImageStorageService carouselImageStorageService;

    @Transactional(readOnly = true)
    public HomeContentResponse getHomeContent() {
        return new HomeContentResponse(getCarousels(), getFeaturedProjects());
    }

    @Transactional(readOnly = true)
    public List<MainCarouselResponse> getCarousels() {
        return mainCarouselRepository.findAll().stream()
            .sorted(Comparator.comparing(MainCarousel::getCarouselId))
            .map(MainCarouselResponse::from)
            .toList();
    }

    public MainCarouselResponse createCarousel(MainCarouselUpsertRequest request) {
        validateCarousel(request);
        MainCarousel entity = new MainCarousel();
        applyCarousel(entity, request);
        return MainCarouselResponse.from(mainCarouselRepository.save(entity));
    }

    public MainCarouselResponse updateCarousel(Long carouselId, MainCarouselUpsertRequest request) {
        validateCarousel(request);
        MainCarousel entity = findCarousel(carouselId);
        applyCarousel(entity, request);
        return MainCarouselResponse.from(mainCarouselRepository.save(entity));
    }

    public void deleteCarousel(Long carouselId) {
        MainCarousel entity = findCarousel(carouselId);
        carouselImageStorageService.deleteFile(entity.getBackgroundUrl());
        mainCarouselRepository.delete(entity);
    }

    public MainCarouselResponse uploadCarouselImage(Long carouselId, MultipartFile image) {
        MainCarousel entity = findCarousel(carouselId);
        String previous = entity.getBackgroundUrl();
        String imageUrl = carouselImageStorageService.save(image, carouselId);
        entity.setBackgroundUrl(imageUrl);
        entity = mainCarouselRepository.save(entity);
        if (previous != null && !Objects.equals(previous, imageUrl)) {
            carouselImageStorageService.deleteFile(previous);
        }
        return MainCarouselResponse.from(entity);
    }

    @Transactional(readOnly = true)
    public List<HomeFeaturedProjectResponse> getFeaturedProjects() {
        List<HomeFeaturedPortfolio> slots = homeFeaturedPortfolioRepository.findAllByOrderBySlotIndexAsc();
        if (slots.isEmpty()) return List.of();

        List<Long> portfolioIds = slots.stream().map(HomeFeaturedPortfolio::getPortfolioId).distinct().toList();
        Map<Long, Portfolio> portfolioMap = new LinkedHashMap<>();
        for (Portfolio portfolio : portfolioRepository.findAllById(portfolioIds)) {
            portfolioMap.put(portfolio.getPortfolioId(), portfolio);
        }

        List<HomeFeaturedProjectResponse> result = new ArrayList<>();
        for (HomeFeaturedPortfolio slot : slots) {
            Portfolio p = portfolioMap.get(slot.getPortfolioId());
            if (p == null) continue;
            String thumbnailUrl = (p.getPortfolioImages() == null || p.getPortfolioImages().isEmpty())
                ? null
                : p.getPortfolioImages().stream()
                    .sorted(Comparator.comparingInt(img -> img.getOrderIndex()))
                    .findFirst()
                    .map(img -> img.getImageUrl())
                    .orElse(null);
            result.add(new HomeFeaturedProjectResponse(
                slot.getSlotIndex(),
                p.getPortfolioId(),
                p.getTitle(),
                p.getCategory(),
                thumbnailUrl
            ));
        }
        result.sort(Comparator.comparingInt(item -> item.slotIndex() == null ? 999 : item.slotIndex()));
        return result;
    }

    public List<HomeFeaturedProjectResponse> updateFeaturedProjects(HomeFeaturedProjectsUpdateRequest request) {
        if (request == null || request.portfolioIds() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "포트폴리오 ID 목록이 필요합니다.");
        }

        List<Long> ids = request.portfolioIds().stream()
            .filter(Objects::nonNull)
            .distinct()
            .limit(3)
            .toList();

        if (!ids.isEmpty()) {
            long count = portfolioRepository.findAllById(ids).stream().count();
            if (count != ids.size()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "존재하지 않는 포트폴리오가 포함되어 있습니다.");
            }
        }

        homeFeaturedPortfolioRepository.deleteAll(homeFeaturedPortfolioRepository.findAll());
        int slot = 1;
        for (Long id : ids) {
            HomeFeaturedPortfolio entity = new HomeFeaturedPortfolio();
            entity.setSlotIndex(slot++);
            entity.setPortfolioId(id);
            homeFeaturedPortfolioRepository.save(entity);
        }
        return getFeaturedProjects();
    }

    private MainCarousel findCarousel(Long carouselId) {
        return mainCarouselRepository.findById(carouselId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "캐러셀 슬라이드를 찾을 수 없습니다."));
    }

    private void validateCarousel(MainCarouselUpsertRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청 본문이 비어 있습니다.");
        }
        if (isBlank(request.title())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "메인 제목을 입력해주세요.");
        }
    }

    private void applyCarousel(MainCarousel entity, MainCarouselUpsertRequest request) {
        entity.setTitle(request.title().trim());
        entity.setSubtitle(blankToNull(request.subtitle()));
        entity.setButtonText(blankToNull(request.buttonText()));
        entity.setButtonLink(blankToNull(request.buttonLink()));
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }
}

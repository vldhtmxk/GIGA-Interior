package com.demo.domain.client.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.demo.domain.client.dto.request.ClientPartnerUpsertRequest;
import com.demo.domain.client.dto.response.ClientPartnerResponse;
import com.demo.domain.client.entity.ClientPartner;
import com.demo.domain.client.enums.ClientCategory;
import com.demo.domain.client.repository.ClientPartnerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientPartnerService {

    private final ClientPartnerRepository clientPartnerRepository;
    private final ClientLogoStorageService clientLogoStorageService;

    @Transactional(readOnly = true)
    public List<ClientPartnerResponse> getAll(String category) {
        if (category == null || category.isBlank()) {
            return clientPartnerRepository.findAll().stream()
                .sorted((a, b) -> Long.compare(b.getClientId(), a.getClientId()))
                .map(ClientPartnerResponse::from)
                .toList();
        }

        ClientCategory resolved = parseCategory(category);
        return clientPartnerRepository.findAllByCategoryOrderByClientIdDesc(resolved).stream()
            .map(ClientPartnerResponse::from)
            .toList();
    }

    public ClientPartnerResponse create(ClientPartnerUpsertRequest request) {
        validate(request);
        ClientPartner entity = new ClientPartner();
        apply(entity, request);
        return ClientPartnerResponse.from(clientPartnerRepository.save(entity));
    }

    public ClientPartnerResponse update(Long clientId, ClientPartnerUpsertRequest request) {
        validate(request);
        ClientPartner entity = find(clientId);
        apply(entity, request);
        return ClientPartnerResponse.from(clientPartnerRepository.save(entity));
    }

    public void delete(Long clientId) {
        ClientPartner entity = find(clientId);
        clientLogoStorageService.deleteLogoFile(entity.getLogoUrl());
        clientPartnerRepository.delete(entity);
    }

    public ClientPartnerResponse uploadLogo(Long clientId, MultipartFile logo) {
        ClientPartner entity = find(clientId);
        String previousLogo = entity.getLogoUrl();
        String newLogo = clientLogoStorageService.saveLogo(logo, clientId);
        entity.setLogoUrl(newLogo);
        entity = clientPartnerRepository.save(entity);
        if (previousLogo != null && !previousLogo.equals(newLogo)) {
            clientLogoStorageService.deleteLogoFile(previousLogo);
        }
        return ClientPartnerResponse.from(entity);
    }

    private ClientPartner find(Long clientId) {
        return clientPartnerRepository.findById(clientId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "고객사/파트너 정보를 찾을 수 없습니다."));
    }

    private void validate(ClientPartnerUpsertRequest request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "요청 본문이 비어 있습니다.");
        }
        if (isBlank(request.name()) || request.name().trim().length() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "회사명을 2자 이상 입력해주세요.");
        }
        parseCategory(request.category());
    }

    private void apply(ClientPartner entity, ClientPartnerUpsertRequest request) {
        entity.setName(request.name().trim());
        entity.setCategory(parseCategory(request.category()));
        entity.setDescription(blankToNull(request.description()));
    }

    private ClientCategory parseCategory(String value) {
        if (isBlank(value)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "카테고리(client/partner)를 선택해주세요.");
        }
        String normalized = value.trim().toUpperCase();
        if ("CLIENT".equals(normalized) || "CLIENTS".equals(normalized)) return ClientCategory.CLIENT;
        if ("PARTNER".equals(normalized) || "PARTNERS".equals(normalized)) return ClientCategory.PARTNER;
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "카테고리 값이 올바르지 않습니다. (client|partner)");
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }

    private String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }
}

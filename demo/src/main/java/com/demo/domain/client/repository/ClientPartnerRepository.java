package com.demo.domain.client.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.demo.domain.client.entity.ClientPartner;
import com.demo.domain.client.enums.ClientCategory;

public interface ClientPartnerRepository extends JpaRepository<ClientPartner, Long> {
    List<ClientPartner> findAllByCategoryOrderByClientIdDesc(ClientCategory category);
}

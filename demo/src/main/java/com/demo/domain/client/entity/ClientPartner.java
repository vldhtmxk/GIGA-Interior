package com.demo.domain.client.entity;

import com.demo.domain.client.enums.ClientCategory;
import com.demo.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "client_partner")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientPartner extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "client_id")
    private Long clientId;

    @Column(length = 100, nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClientCategory category;

    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @Column(columnDefinition = "TEXT")
    private String description;
}